import sys
import os
import time
import threading
import asyncio

def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)

log("Starting environment concurrency diagnostic...")

# Test 1: Threading
log("Test 1: Testing Threading...")
try:
    def thread_func():
        log("Inside thread - START")
        time.sleep(0.1)
        log("Inside thread - END")
        
    t = threading.Thread(target=thread_func)
    t.start()
    t.join(timeout=5)
    if t.is_alive():
        log("Test 1 Result: Thread HANGED (timeout reached)")
    else:
        log("Test 1 Result: Threading OK")
except Exception as e:
    log(f"Test 1 Result: Threading FAILED: {str(e)}")

# Test 2: Asyncio
log("Test 2: Testing Asyncio...")
try:
    async def async_func():
        log("Inside async func - START")
        await asyncio.sleep(0.1)
        log("Inside async func - END")
        return "OK"
    
    result = asyncio.run(async_func())
    log(f"Test 2 Result: Asyncio OK, result={result}")
except Exception as e:
    log(f"Test 2 Result: Asyncio FAILED: {str(e)}")

log("All diagnostics finished.")
