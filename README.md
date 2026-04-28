# AI-Powered Resume Screening System

Production-ready starter built with Next.js App Router + TypeScript + Prisma + MySQL + Groq.

## Simplified flow (No Auth)

The app now runs in **single-recruiter mode** to keep the product simple:
- No login/signup pages
- No auth tokens/cookies
- A system recruiter is auto-created in the database and used transparently by APIs

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`.
3. Add your `GROQ_API_KEY` to `.env`.
4. Run Prisma migrate: `npx prisma migrate dev`.
5. Start app: `npm run dev`.
6. Open `/` and start creating jobs, uploading resumes, and generating rankings.

## Docker

```bash
docker compose up --build
```

## Architecture

- `app/api/*`: Route handlers + validation
- `services/*`: Business logic layer
- `lib/ai/*`: LLM and semantic matching wrappers
- `prisma/schema.prisma`: DB schema
- `components` + `ui`: Presentation layer
