# AWS Deployment Notes (MVP)

## Suggested Services

1. API Service:
- ECS Fargate service for `apps/api` container.
- ALB in front of API.

2. Worker Service:
- ECS Fargate scheduled task for weekly and reminder jobs.
- Alternative: EventBridge scheduled rule calling worker endpoint.

3. Database:
- MongoDB Atlas (recommended) or self-managed Mongo on EC2.

4. Secrets:
- AWS Secrets Manager for JWT keys and DB URI.

5. Observability:
- CloudWatch logs + alarms for API/worker failures.

## Baseline Environment Variables

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `MATCH_TIMEZONE=America/Chicago`
- `MATCH_COOLDOWN_WEEKS=4`
