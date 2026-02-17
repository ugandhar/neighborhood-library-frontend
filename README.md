# Neighborhood Library Frontend

Minimal Next.js frontend for the Neighborhood Library backend.

## Run Frontend Server (frontend repo)

From the frontend repo:

```bash
cd /Users/swethareddy/projects/neighborhood-library-frontend
cp .env.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Run with Backend

Start backend first from `/Users/swethareddy/projects/Library/backend`:

```bash
docker compose up -d db
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then start frontend from `/Users/swethareddy/projects/neighborhood-library-frontend`:

```bash
npm run dev
```

## Features

- Create and list books
- Create and list members
- Borrow a book for a member
- Return active loans
- Query borrowed books for a selected member

## Environment

- `NEXT_PUBLIC_API_BASE_URL` (default `http://127.0.0.1:8000`)
