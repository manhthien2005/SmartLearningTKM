# 🚀 Hướng Dẫn Setup CI/CD GitLab cho SmartLearning

## 📋 Mục Lục
1. [Cấu Hình Variables](#cấu-hình-variables)
2. [Setup Server](#setup-server)
3. [Deploy Workflow](#deploy-workflow)
4. [Troubleshooting](#troubleshooting)

---

## ⚙️ Cấu Hình Variables

### Truy cập GitLab Settings
1. Vào repository GitLab
2. **Settings** → **CI/CD** → **Variables** → **Expand**

### Thêm Variables Sau:

#### **Database Configuration**
```
DATABASE_URL
Type: Variable
Value: postgresql://username:password@host:5432/smartlearning
Protected: ✅
Masked: ✅
```

#### **JWT & Security**
```
JWT_SECRET
Type: Variable
Value: <your-secure-jwt-secret-key>
Protected: ✅
Masked: ✅
```

#### **Email Configuration**
```
EMAIL_USER
Type: Variable
Value: your-email@gmail.com
Protected: ✅
Masked: ❌

EMAIL_PASS
Type: Variable
Value: <your-app-password>
Protected: ✅
Masked: ✅
```

#### **SSH Configuration**
```
SSH_PRIVATE_KEY
Type: File or Variable
Value: -----BEGIN OPENSSH PRIVATE KEY-----
       <your-private-key-content>
       -----END OPENSSH PRIVATE KEY-----
Protected: ✅
Masked: ✅

SSH_USER
Type: Variable
Value: deploy
Protected: ✅
Masked: ❌

SSH_HOST
Type: Variable
Value: your-server-ip-address
Protected: ✅
Masked: ❌
```

#### **Deployment Paths**
```
DEPLOY_PATH
Type: Variable
Value: /var/www/smartlearning
Protected: ✅
Masked: ❌

STAGING_PATH
Type: Variable
Value: /var/www/smartlearning-staging
Protected: ❌
Masked: ❌
```

#### **Frontend Environment**
```
NEXT_PUBLIC_API_URL
Type: Variable
Value: https://api.smartlearning.com (production)
       https://staging-api.smartlearning.com (staging)
Protected: ❌
Masked: ❌
```

#### **Optional: Docker Registry**
```
CI_REGISTRY
Type: Variable
Value: registry.gitlab.com
Protected: ❌
Masked: ❌

CI_REGISTRY_USER
Type: Variable
Value: <your-gitlab-username>
Protected: ✅
Masked: ❌

CI_REGISTRY_PASSWORD
Type: Variable
Value: <your-gitlab-token>
Protected: ✅
Masked: ✅
```

---

## 🖥️ Setup Server

### 1. Cài Đặt Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2. Tạo User Deploy

```bash
# Tạo user deploy
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy

# Switch to deploy user
su - deploy
```

### 3. Setup SSH Key

```bash
# Trên máy local, tạo SSH key
ssh-keygen -t ed25519 -C "deploy@smartlearning" -f ~/.ssh/gitlab_deploy

# Copy public key lên server
ssh-copy-id -i ~/.ssh/gitlab_deploy.pub deploy@your-server-ip

# Test connection
ssh -i ~/.ssh/gitlab_deploy deploy@your-server-ip

# Copy private key content để add vào GitLab Variables
cat ~/.ssh/gitlab_deploy
```

### 4. Tạo Thư Mục Deploy

```bash
# Trên server
sudo mkdir -p /var/www/smartlearning
sudo mkdir -p /var/www/smartlearning-staging
sudo chown -R deploy:deploy /var/www/smartlearning
sudo chown -R deploy:deploy /var/www/smartlearning-staging

# Clone repository (lần đầu)
cd /var/www
git clone <your-gitlab-repo-url> smartlearning
cd smartlearning
git checkout main

# Staging
cd /var/www
git clone <your-gitlab-repo-url> smartlearning-staging
cd smartlearning-staging
git checkout develop
```

### 5. Setup Environment Files

```bash
# Production
cd /var/www/smartlearning
nano .env

# Paste nội dung từ env.example và cập nhật giá trị thật
# Lưu file: Ctrl+X, Y, Enter

# Staging
cd /var/www/smartlearning-staging
nano .env
# Cập nhật với giá trị staging
```

### 6. Setup Database

```bash
# Start PostgreSQL container
cd /var/www/smartlearning
docker-compose -f docker-compose.prod.yml up -d postgres

# Wait for PostgreSQL to start
sleep 10

# Run migrations
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 7. Setup Firewall (Optional nhưng recommended)

```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application ports
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 5000/tcp  # Backend

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

## 🔄 Deploy Workflow

### Pipeline Flow

```
┌─────────────┐
│   PUSH      │
│ to GitLab   │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Install    │
│Dependencies │
└──────┬──────┘
       │
       v
┌─────────────┐
│    Lint     │
│ (parallel)  │
└──────┬──────┘
       │
       v
┌─────────────┐
│    Build    │
│ (parallel)  │
└──────┬──────┘
       │
       v
┌─────────────┐
│    Test     │
└──────┬──────┘
       │
       v
┌─────────────┐
│   Deploy    │
│  (manual)   │
└─────────────┘
```

### Deploy Commands

#### **Deploy to Staging**
1. Push code lên branch `develop`
2. Vào **CI/CD** → **Pipelines**
3. Chờ build xong
4. Click nút **Play** ở job `deploy:staging`
5. Confirm deployment

#### **Deploy to Production**
1. Merge `develop` → `main`
2. Vào **CI/CD** → **Pipelines**
3. Chờ build và test xong
4. Click nút **Play** ở job `deploy:production`
5. Confirm deployment

#### **Run Database Migration**
```bash
# Trực tiếp trên server
cd /var/www/smartlearning/backend
npx prisma migrate deploy

# Hoặc qua GitLab CI/CD
# Click job "migrate:production"
```

#### **Rollback Production**
```bash
# Qua GitLab CI/CD
# Click job "rollback:production"

# Hoặc manual trên server
cd /var/www/smartlearning
git reset --hard HEAD~1
docker-compose -f docker-compose.prod.yml restart
```

---

## 🛠️ Troubleshooting

### 1. Pipeline Failed at Install Stage

**Problem:** `npm ci` fails

**Solution:**
```bash
# Xóa cache
# Vào GitLab: CI/CD → Pipelines → Clear runner cache

# Hoặc update package-lock.json
npm install
git add package-lock.json
git commit -m "chore: update lock file"
git push
```

### 2. SSH Connection Failed

**Problem:** Cannot connect to server

**Solution:**
```bash
# Test SSH locally
ssh -i ~/.ssh/gitlab_deploy deploy@your-server-ip

# Check SSH_PRIVATE_KEY format
# Phải bao gồm header và footer:
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

# Re-add SSH key to GitLab Variables
```

### 3. Docker Build Failed

**Problem:** Docker build errors

**Solution:**
```bash
# Test build locally
cd backend
docker build --target production -t test-backend .

cd frontend
docker build --target production -t test-frontend .

# Check Dockerfile syntax
# Check .dockerignore
```

### 4. Database Connection Error

**Problem:** Cannot connect to database

**Solution:**
```bash
# Check DATABASE_URL format
postgresql://user:password@host:5432/database

# Test connection on server
docker exec -it smartlearning-backend-prod sh
npx prisma db push
```

### 5. Frontend Build Failed

**Problem:** Next.js build errors

**Solution:**
```bash
# Check NEXT_PUBLIC_API_URL
# Must be set in GitLab Variables

# Test build locally
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:5000 npm run build
```

### 6. Deployment Timeout

**Problem:** Deployment takes too long

**Solution:**
```bash
# Increase timeout in .gitlab-ci.yml
deploy:production:
  timeout: 30m  # Add this line

# Or deploy manually on server
ssh deploy@your-server-ip
cd /var/www/smartlearning
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 Monitoring Pipeline

### View Logs
```bash
# GitLab UI
CI/CD → Pipelines → Click job → View logs

# Server logs
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### Check Status
```bash
# On server
docker ps
docker-compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats
```

---

## 🎯 Best Practices

1. **Luôn test trên staging trước khi deploy production**
2. **Backup database trước khi migrate**
3. **Sử dụng manual deployment cho production**
4. **Monitor logs sau khi deploy**
5. **Giữ secrets an toàn trong GitLab Variables**
6. **Regular backup và disaster recovery plan**

---

## 📞 Support Checklist

Khi gặp lỗi, check theo thứ tự:

- [ ] Pipeline logs trên GitLab
- [ ] Server connection (SSH)
- [ ] Environment variables
- [ ] Docker containers status
- [ ] Database connection
- [ ] Application logs
- [ ] Network/firewall rules
- [ ] Disk space và resources

---

**Tạo bởi:** SmartLearning Team  
**Updated:** 2024

