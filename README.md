<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15OpszFQw0_H8s3mxEdwMstJlALk6MFiW

<p>The fastest path from prompt to production with Gemini.</p>

<a href="https://aistudio.google.com/apps">Start building</a>

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend Setup (Python)

**Prerequisites:** Python 3.10+

1. Navigate to the backend directory:
   `cd backend`
2. Install dependencies:
   `pip install -r requirements.txt`
3. Set your `GEMINI_API_KEY` in `backend/.env`
4. Run the FastAPI server:
   `python -m uvicorn main:app --reload --root-path /api`

The API will be available at `http://localhost:8000/api`.

## Testing

### End-to-End Tests (TestCafe)

**Prerequisites:** Both frontend and backend must be running

1. Start the frontend:
   `npm run dev`
2. Start the backend:
   `cd backend && python -m uvicorn main:app --reload --root-path /api`
3. Run tests:
   - All tests: `npm run test:e2e`
   - Headless mode: `npm run test:e2e:headless`
   - Firefox: `npm run test:e2e:firefox`

See [tests/README.md](tests/README.md) for detailed testing documentation.
