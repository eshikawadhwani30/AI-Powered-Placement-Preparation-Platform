# AI-Powered Placement Preparation Platform

A MERN placement-preparation platform with JWT-protected APIs, resume analysis, interview practice, sample job matching, DSA tracking, server-scored aptitude tests, and a personalized roadmap.

## Run locally on Windows

1. Install Node.js 20+ and start MongoDB locally, or create a MongoDB Atlas database.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, a long random `JWT_SECRET`, and (optionally) `GEMINI_API_KEY`. Never commit this file.
3. Install packages from the project root:

   ```powershell
   npm install --prefix backend
   npm install --prefix frontend
   ```

4. Start the API and client in separate PowerShell windows:

   ```powershell
   npm run server
   npm run client
   ```

   Visit `http://localhost:5173`. The API starts on `http://localhost:5000` and seeds clearly labelled sample jobs, DSA questions, and aptitude questions when MongoDB connects.

## Checks

```powershell
npm test --prefix backend
npm run build --prefix frontend
```

The backend tests cover authentication, protected endpoints, role checks, dashboard calculation, resume and interview input validation, job authorization, aptitude server-side scoring, and the Phase 7–9 learning modules.

## Deployment checklist

- Use MongoDB Atlas and a production-only `MONGODB_URI`.
- Generate a unique, high-entropy `JWT_SECRET` (for example, with a password manager).
- Set `NODE_ENV=production`, `CLIENT_URL` to the deployed frontend origin, and configure HTTPS.
- Set the frontend `VITE_API_URL` to the deployed API URL plus `/api`.
- Keep `GEMINI_API_KEY` only in the backend host's secrets manager.
- Do not describe seeded jobs as live vacancies, or AI feedback/readiness values as guaranteed outcomes.
