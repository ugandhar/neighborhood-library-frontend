# Neighborhood Library Frontend

Next.js frontend for the Neighborhood Library backend.

## Prerequisites

- Node.js 18+ and `npm`

Install via Homebrew:

```bash
brew install node
```

Verify:

```bash
node --version
npm --version
```

## Clone And Run

Clone the frontend repository and start server:

```bash
git clone git@github.com:ugandhar/neighborhood-library-frontend.git
cd neighborhood-library-frontend
cp .env.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Run with Backend

Start backend first from cloned backend repo:

```bash
git clone git@github.com:ugandhar/Library.git
cd Library/backend
docker compose up -d db
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then start frontend from `neighborhood-library-frontend`:

```bash
npm run dev
```

## Run Frontend Tests

From frontend repo:

```bash
cd neighborhood-library-frontend
npm test -- --runInBand
```

## Features

- Create and list books
- Create and list members
- Borrow a book for a member
- Return active loans
- Query borrowed books for a selected member

## Environment

- `NEXT_PUBLIC_API_BASE_URL` (default `http://127.0.0.1:8000`)
