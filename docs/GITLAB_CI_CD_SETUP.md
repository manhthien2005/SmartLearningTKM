# Hướng dẫn triển khai SmartLearning lên GitLab với CI/CD

## 📋 Mục lục
1. [Chuẩn bị dự án](#chuẩn-bị-dự-án)
2. [Tạo repository trên GitLab](#tạo-repository-trên-gitlab)
3. [Cấu hình GitLab CI/CD](#cấu-hình-gitlab-cicd)
4. [Docker Configuration](#docker-configuration)
5. [Environment Variables](#environment-variables)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Chuẩn bị dự án

### 1. Tạo file `.gitignore`
```gitignore
# Dependencies
node_modules/
*/node_modules/

# Production builds
.next/
dist/
build/

# Environment variables
.env
.env.local
.env.production
.env.staging

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Prisma
prisma/migrations/
```

### 2. Tạo file `.gitlab-ci.yml`
```yaml
# GitLab CI/CD Pipeline cho SmartLearning
stages:
  - install
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "18"
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

# Cache dependencies
cache:
  paths:
    - node_modules/
    - frontend/node_modules/
    - backend/node_modules/

# Install dependencies
install_dependencies:
  stage: install
  image: node:18
  script:
    - npm ci
    - cd frontend && npm ci
    - cd ../backend && npm ci
  cache:
    paths:
      - node_modules/
      - frontend/node_modules/
      - backend/node_modules/
    policy: pull-push

# Build Frontend
build_frontend:
  stage: build
  image: node:18
  script:
    - cd frontend
    - npm run build
  artifacts:
    paths:
      - frontend/.next/
    expire_in: 1 hour
  only:
    - main
    - develop

# Build Backend
build_backend:
  stage: build
  image: node:18
  script:
    - cd backend
    - npm run build
  artifacts:
    paths:
      - backend/dist/
    expire_in: 1 hour
  only:
    - main
    - develop

# Run Tests (nếu có)
test_frontend:
  stage: test
  image: node:18
  script:
    - cd frontend
    - npm run lint
    - npm run type-check
  only:
    - main
    - develop

# Deploy to Production
deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - echo "Deploying to production server..."
    - ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "cd $DEPLOY_PATH && git pull origin main"
    - ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "cd $DEPLOY_PATH && docker-compose down"
    - ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "cd $DEPLOY_PATH && docker-compose up -d --build"
  only:
    - main
  when: manual

# Deploy to Staging
deploy_staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
  script:
    - echo "Deploying to staging server..."
    - ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "cd $STAGING_PATH && git pull origin develop"
    - ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "cd $STAGING_PATH && docker-compose up -d --build"
  only:
    - develop
  when: manual
```

### 3. Tạo Docker Configuration

#### `Dockerfile.frontend`
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### `Dockerfile.backend`
```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY backend/ .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 5000

ENV PORT 5000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "dist/server.js"]
```

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend
    networks:
      - smartlearning

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}
    depends_on:
      - postgres
    networks:
      - smartlearning

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=smartlearning
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - smartlearning

volumes:
  postgres_data:

networks:
  smartlearning:
    driver: bridge
```

---

## 🔧 Tạo repository trên GitLab

### 1. Tạo repository mới
1. Đăng nhập GitLab
2. Click "New Project" → "Create blank project"
3. Đặt tên: `smartlearning-platform`
4. Chọn visibility: Private hoặc Public
5. Click "Create project"

### 2. Push code lên GitLab
```bash
# Khởi tạo git repository (nếu chưa có)
git init

# Thêm remote origin
git remote add origin https://gitlab.com/your-username/smartlearning-platform.git

# Thêm tất cả files
git add .

# Commit lần đầu
git commit -m "Initial commit: SmartLearning Platform"

# Push lên GitLab
git push -u origin main
```

---

## ⚙️ Cấu hình GitLab CI/CD

### 1. Setup CI/CD Variables
Vào **Settings** → **CI/CD** → **Variables**, thêm các biến:

| Key | Value | Protected | Masked |
|-----|-------|-----------|--------|
| `DATABASE_URL` | `postgresql://user:pass@host:port/db` | ✅ | ✅ |
| `JWT_SECRET` | `your-jwt-secret` | ✅ | ✅ |
| `EMAIL_USER` | `your-email@gmail.com` | ✅ | ❌ |
| `EMAIL_PASS` | `your-app-password` | ✅ | ✅ |
| `SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | ✅ | ✅ |
| `SSH_USER` | `deploy` | ✅ | ❌ |
| `SSH_HOST` | `your-server-ip` | ✅ | ❌ |
| `DEPLOY_PATH` | `/var/www/smartlearning` | ✅ | ❌ |
| `STAGING_PATH` | `/var/www/smartlearning-staging` | ✅ | ❌ |

### 2. Cấu hình Runners
- Vào **Settings** → **CI/CD** → **Runners**
- Sử dụng GitLab Shared Runners (miễn phí)
- Hoặc setup Self-hosted Runner

---

## 🐳 Docker Configuration

### 1. Tạo các file Docker
Tạo các file Dockerfile như đã cung cấp ở trên.

### 2. Test Docker locally
```bash
# Build và chạy local
docker-compose up --build

# Test frontend: http://localhost:3000
# Test backend: http://localhost:5000
```

---

## 🌍 Environment Variables

### 1. Tạo `.env.production`
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="your-production-jwt-secret"

# Email
EMAIL_USER="your-production-email@gmail.com"
EMAIL_PASS="your-app-password"

# NextAuth
NEXTAUTH_SECRET="your-production-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"

# API
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
```

### 2. Tạo `.env.staging`
```env
# Database
DATABASE_URL="postgresql://user:password@staging-host:port/database"

# JWT
JWT_SECRET="your-staging-jwt-secret"

# Email
EMAIL_USER="your-staging-email@gmail.com"
EMAIL_PASS="your-app-password"

# NextAuth
NEXTAUTH_SECRET="your-staging-nextauth-secret"
NEXTAUTH_URL="https://staging.your-domain.com"

# API
NEXT_PUBLIC_API_URL="https://staging-api.your-domain.com"
```

---

## 🚀 Deployment

### 1. Server Setup
```bash
# Cài đặt Docker trên server
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Tạo thư mục deploy
sudo mkdir -p /var/www/smartlearning
sudo chown $USER:$USER /var/www/smartlearning
```

### 2. SSH Key Setup
```bash
# Tạo SSH key pair
ssh-keygen -t rsa -b 4096 -C "deploy@smartlearning"

# Copy public key lên server
ssh-copy-id deploy@your-server-ip

# Test connection
ssh deploy@your-server-ip
```

### 3. Database Migration
```bash
# Chạy migration trên server
cd /var/www/smartlearning/backend
npx prisma migrate deploy
npx prisma generate
```

---

## 📊 Monitoring & Logs

### 1. GitLab CI/CD Monitoring
- Vào **CI/CD** → **Pipelines** để xem trạng thái
- Click vào job để xem logs chi tiết

### 2. Application Logs
```bash
# Xem logs của containers
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f frontend
docker-compose logs -f backend
```

---

## 🔧 Troubleshooting

### 1. Build Failures
- Kiểm tra Node.js version compatibility
- Verify all dependencies được install đúng
- Check environment variables

### 2. Deployment Issues
- Verify SSH connection
- Check server disk space
- Verify Docker daemon running

### 3. Database Connection
- Verify DATABASE_URL format
- Check database server accessibility
- Run Prisma migrations

### 4. Common Issues

#### Issue: "npm ci" fails
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Docker build fails
```bash
# Solution: Check Dockerfile syntax
docker build -t test-image .
```

#### Issue: SSH connection fails
```bash
# Solution: Test SSH connection
ssh -v deploy@your-server-ip
```

---

## 📈 Next Steps

1. **Setup Monitoring**: Prometheus + Grafana
2. **SSL Certificate**: Let's Encrypt với Certbot
3. **Load Balancer**: Nginx reverse proxy
4. **Backup Strategy**: Automated database backups
5. **Security**: Firewall rules, fail2ban

---

## 📞 Support

Nếu gặp vấn đề, check:
1. GitLab CI/CD logs
2. Docker container logs
3. Server system logs
4. Database connection logs

---

## 🎯 Quick Start Checklist

- [ ] Tạo file `.gitignore`
- [ ] Tạo file `.gitlab-ci.yml`
- [ ] Tạo `Dockerfile.frontend`
- [ ] Tạo `Dockerfile.backend`
- [ ] Tạo `docker-compose.yml`
- [ ] Tạo GitLab repository
- [ ] Setup CI/CD variables
- [ ] Test Docker locally
- [ ] Deploy to staging
- [ ] Deploy to production







