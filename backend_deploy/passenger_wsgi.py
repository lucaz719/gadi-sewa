import sys, os
import asyncio

sys.path.insert(0, os.path.dirname(__file__))

# Import the FastAPI app
from main import app

def application(environ, start_response):
    """Custom single-threaded ASGI-to-WSGI bridge for Passenger.
    
    Uses asyncio.run() instead of a2wsgi's threading model, which
    deadlocks on shared hosting environments (CloudLinux/cPanel).
    """
    # Read request body
    try:
        content_length = int(environ.get('CONTENT_LENGTH', 0) or 0)
    except (ValueError):
        content_length = 0
    
    if content_length > 0:
        request_body = environ['wsgi.input'].read(content_length)
    else:
        request_body = b''

    # Build ASGI scope
    scope = {
        'type': 'http',
        'http_version': '1.1',
        'method': environ['REQUEST_METHOD'],
        'path': environ['PATH_INFO'],
        'root_path': '',
        'query_string': environ.get('QUERY_STRING', '').encode('ascii'),
        'headers': [
            (k[5:].replace('_', '-').lower().encode('ascii'), v.encode('ascii'))
            for k, v in environ.items() if k.startswith('HTTP_')
        ],
    }
    
    # Add Content-Type and Content-Length headers
    if 'CONTENT_TYPE' in environ:
        scope['headers'].append((b'content-type', environ['CONTENT_TYPE'].encode('ascii')))
    if 'CONTENT_LENGTH' in environ:
        scope['headers'].append((b'content-length', environ['CONTENT_LENGTH'].encode('ascii')))

    response_headers = []
    response_status = "200 OK"
    response_body = []

    async def receive():
        return {
            'type': 'http.request',
            'body': request_body,
            'more_body': False
        }

    async def send(message):
        nonlocal response_status, response_headers
        if message['type'] == 'http.response.start':
            status_code = message['status']
            status_reasons = {
                200: 'OK', 201: 'Created', 204: 'No Content',
                301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
                400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
                404: 'Not Found', 405: 'Method Not Allowed',
                422: 'Unprocessable Entity', 500: 'Internal Server Error'
            }
            reason = status_reasons.get(status_code, 'Unknown')
            response_status = f"{status_code} {reason}"
            response_headers = [(k.decode('ascii'), v.decode('ascii')) for k, v in message['headers']]
        elif message['type'] == 'http.response.body':
            response_body.append(message.get('body', b''))

    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(app(scope, receive, send))
        loop.close()
        
        start_response(response_status, response_headers)
        return response_body
    except Exception as e:
        import traceback
        error_msg = f"Internal Server Error: {str(e)}\n{traceback.format_exc()}"
        import sys
        print(error_msg, file=sys.stderr)
        start_response("500 Internal Server Error", [("Content-Type", "text/plain")])
        return [error_msg.encode('utf-8')]
