# AI-Powered Resume Screening System

Production-ready starter built with Next.js App Router + TypeScript + Prisma + MySQL + Groq.

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`.
3. Add your `GROQ_API_KEY` to `.env`.
4. Run Prisma migrate: `npx prisma migrate dev`.
5. Start app: `npm run dev`.

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
