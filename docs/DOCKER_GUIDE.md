# 🐳 Docker Guide

## Development

```bash
# Start all services (dev mode with hot reload)
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production
docker-compose -f docker-compose.prod.yml down
```

## Database Migration

```bash
# Run migration inside container
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma Client
docker-compose exec backend npx prisma generate
```

## Environment Variables

Tạo file `.env` ở root với nội dung:

```env
# Database
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=smartlearning
DATABASE_PORT=5432
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/smartlearning

# Backend
BACKEND_PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Frontend
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Useful Commands

```bash
# Rebuild containers
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v

# Shell vào backend container
docker-compose exec backend sh

# Shell vào database
docker-compose exec postgres psql -U postgres -d smartlearning
```
