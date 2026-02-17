# Neighborhood Library Frontend

Minimal Next.js frontend for the Neighborhood Library backend.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Features

- Create and list books
- Create and list members
- Borrow a book for a member
- Return active loans
- Query borrowed books for a selected member

## Environment

- `NEXT_PUBLIC_API_BASE_URL` (default `http://127.0.0.1:8000`)
