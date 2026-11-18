# DualMind — Frontend

React 18 + TypeScript + Vite + React Router, built from the 13 DualMind screens.

## Run

Open two terminals in the project folder. Without hosted credentials, the backend runs in local development mode and stores data in `server/data/db.json`.

```bash
npm install
npm run server   # API at http://localhost:3001
```

In the second terminal:

```bash
npm run dev      # http://localhost:5173
```

Vite forwards `/api` requests to the backend. `npm run build` type-checks and builds the frontend. Restart the backend after pulling or copying backend code changes; the browser UI will hot-reload frontend changes.

## Working research prototype

- Calibration requests camera access only after you opt in and press **Start camera**. MediaPipe Face Landmarker runs in the browser using the local model and local WASM files. Raw video frames are not uploaded or saved.
- Numeric 30-second windows can include face absence, blink/PERCLOS proxies, head-pose and iris-gaze proxies, lighting, typing intervals and pauses, backspace counts, mouse speed, clicks, scrolling, page/visibility switches, and focus-session duration. Typed text and pointer coordinates are never stored.
- The first state estimator is a transparent cold-start heuristic. Confidence is a proxy, not a statistically calibrated probability; the paper reports that its real-world studies have not yet been conducted.
- Interventions use confidence, two-window persistence, a 10-minute cooldown and the configured hourly budget. Cold-start rules suggest breaks, shorter tasks or ambient focus mode. User ratings after ten minutes update a LinUCB model for later suggestions.
- Queue order uses deadlines and task effort with manual overrides. Focus sessions and task completion are saved locally by the backend.

The paper describes a proposed system and planned evaluation, rather than reporting a validated model or completed user study. The trained estimator, dataset collection, held-out calibration, fairness audits, human studies, federated learning, and multi-user WebSocket groups still need data, study approval and deployment infrastructure.

## Prepare a hosted demo

The app can be hosted as one Node web service: Node serves the built Vite frontend and API from the same HTTPS origin. Production mode requires Supabase Auth and PostgreSQL; each authenticated account gets a separate JSONB state row. The database schema is created by the server on startup. This is suitable for a small invite-only demo; move the JSONB state into normalized tables and add operational monitoring before a larger public launch.

1. Push this project to a GitHub repository. Do not commit `.env` files, database URLs, Supabase service-role keys, or other secrets. `.env.example` contains only variable names.
2. Create a Supabase project and enable email/password sign-in. In Supabase **Authentication → URL Configuration**, set the Site URL to your Render URL and add the Render URL and later your custom domain to Redirect URLs.
3. In Supabase, open **Connect**, choose the **Session pooler**, and copy its connection string. Replace the password placeholder with your database password; this connection mode works for Render's outbound IPv4 network. Keep that URL private.
4. In Render, create a Blueprint from the repository and use `render.yaml`. Set `DATABASE_URL` to the Supabase Session Pooler connection string; set `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Supabase. Also set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project URL and public anon/publishable key. The frontend variables are used at build time, so redeploy after changing them.
5. Wait for the deploy, then open `https://<your-render-service>.onrender.com`. Create an account, confirm the email if Supabase requires it, sign in, and verify creating a task persists after refresh. `/api/health` should return `{ "ok": true }`.
6. For GoDaddy, add the custom domain to the Render service first. Then copy the exact DNS records Render displays into GoDaddy DNS Management. Add both the root domain and `www` if you want both names to work, and wait for Render's HTTPS certificate to become active.

Never put a Supabase `service_role` key in the browser or in `VITE_*` variables. The server uses the public anon key only to validate a user's access token; database access uses the Supabase PostgreSQL URL held as a server secret. Production requests without a valid sign-in token are rejected. Supabase's free projects can pause after a week of low activity, so use this setup for a demo and review the provider's current limits before relying on it for regular access.

## Backend API

- `GET /api/health` — API status
- `GET /api/tasks?q=term&status=To%20do` — list and filter tasks
- `POST /api/tasks` — create a task (`title`, optional `notes`, `difficulty`, `estimate`, `deadline`)
- `PATCH /api/tasks/:id` — update task fields or status
- `DELETE /api/tasks/:id` — delete a task
- `GET /api/sessions` / `POST /api/sessions` — read or record focus sessions
- `GET /api/dashboard` — task and focus totals
- `GET /api/queue`, `POST /api/queue/reorder`, `POST /api/queue/reset` — adaptive queue and user overrides
- `POST /api/observe`, `GET /api/observe` — aggregate numeric windows and heuristic state estimates
- `GET /api/decisions`, `POST /api/feedback` — intervention history and delayed feedback
- `GET /api/settings` / `PATCH /api/settings` — read or update settings
- `GET /api/data`, `GET /api/export.csv`, `DELETE /api/data` — inspect, export or delete local stored data

The starter data is local demo data in local mode. Production mode requires authentication and a database connection.

## Routes
| Route | Screen |
|---|---|
| `/welcome` (`/`) | 01 Welcome & consent |
| `/calibration` | 02 Calibration |
| `/dashboard` | 03 Dashboard |
| `/focus` | 04 Focus session |
| `/tasks` | 05 Task manager |
| `/queue` | 06 Adaptive queue |
| `/break-suggestion` | 07 Smart break suggestion |
| `/breather` | 08 Stress-relief break |
| `/ambient` | 09 Ambient focus mode |
| `/analytics` | 10 Analytics |
| `/groups` | 11 Study / work groups |
| `/achievements` | 12 Streaks & badges |
| `/settings` | 13 Privacy & settings |

## Structure
```
src/
  pages/        one component per screen
  components/   Sidebar (shared nav)
  styles/       base.css + per-screen CSS (scoped by .s-<screen> class)
  routes.tsx    route table
```
