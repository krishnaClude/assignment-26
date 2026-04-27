# AI-Powered Resume Screening System

<<<<<<< codex/build-ai-powered-resume-screening-system-auowr9
Production-ready starter built with Next.js App Router + TypeScript + Prisma + MySQL + Groq.
=======
Production-ready starter built with Next.js App Router + TypeScript + Prisma + MySQL + OpenAI.
>>>>>>> main

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`.
<<<<<<< codex/build-ai-powered-resume-screening-system-auowr9
3. Add your `GROQ_API_KEY` to `.env`.
4. Run Prisma migrate: `npx prisma migrate dev`.
5. Start app: `npm run dev`.
=======
3. Run Prisma migrate: `npx prisma migrate dev`.
4. Start app: `npm run dev`.
>>>>>>> main

## Docker

```bash
docker compose up --build
```

## Architecture

- `app/api/*`: Route handlers + validation
- `services/*`: Business logic layer
<<<<<<< codex/build-ai-powered-resume-screening-system-auowr9
- `lib/ai/*`: LLM and semantic matching wrappers
=======
- `lib/ai/*`: LLM and embeddings wrappers
>>>>>>> main
- `prisma/schema.prisma`: DB schema
- `components` + `ui`: Presentation layer
