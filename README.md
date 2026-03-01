# 7even MVP

7even is a mobile-first weekly matching app for Chicago students.

## Monorepo Structure

- `apps/api`: NestJS + MongoDB API (auth, quiz, matching, chat, moderation, scheduler)
- `apps/worker`: NestJS worker process for weekly jobs
- `apps/mobile`: React Native app (iOS + Android)
- `infra`: Docker and deployment artifacts

## Quick Start

1. Install dependencies:
   - `npm install`
2. Copy env files:
   - `cp apps/api/.env.example apps/api/.env`
   - `cp apps/worker/.env.example apps/worker/.env`
3. Start MongoDB locally (or update URI).
4. Run API:
   - `npm run dev:api`
5. Run worker:
   - `npm run dev:worker`
6. Run mobile app:
   - `npm run dev:mobile`

## Core Product Behavior

- Weekly matching every Sunday 10:00 AM America/Chicago
- One exclusive match per active user per cycle
- Top 5 curated suggestions per matched pair
- Real-time 1:1 chat with report/block controls
- Match and chat expire before next weekly cycle

## Security Notes

- .edu OTP email verification required before matching
- JWT access + rotating refresh tokens
- Keyword flagging, rate limits, and account deletion endpoint
