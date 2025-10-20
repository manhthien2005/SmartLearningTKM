# ✅ Deployment Checklist - SmartLearning Platform

## 🎯 Overview
Checklist này giúp đảm bảo mọi thứ được setup đúng cách trước khi deploy.

---

## 📋 Pre-Deployment Setup

### 1. GitLab Repository Setup
- [ ] Repository đã được tạo trên GitLab
- [ ] Branch `main` và `develop` đã được tạo
- [ ] Protected branches đã được config:
  - `main` → Protected, no force push
  - `develop` → Protected, no force push
- [ ] Code đã được push lên GitLab

**Commands:**
```bash
git remote add origin https://gitlab.com/your-username/smartlearning.git
git push -u origin main
git checkout -b develop
git push -u origin develop
```

---

### 2. GitLab CI/CD Variables
- [ ] Truy cập: **Settings → CI/CD → Variables**
- [ ] Thêm các variables sau:

#### Required Variables (Tất cả môi trường)
- [ ] `DATABASE_URL` (Protected ✅, Masked ✅)
- [ ] `JWT_SECRET` (Protected ✅, Masked ✅)
- [ ] `EMAIL_USER` (Protected ✅, Masked ❌)
- [ ] `EMAIL_PASS` (Protected ✅, Masked ✅)
- [ ] `NEXT_PUBLIC_API_URL` (Protected ❌, Masked ❌)
- [ ] `FRONTEND_URL` (Protected ❌, Masked ❌)

#### Deployment Variables
- [ ] `SSH_PRIVATE_KEY` (Protected ✅, Masked ✅)
- [ ] `SSH_USER` (Protected ✅, Masked ❌)
- [ ] `SSH_HOST` (Protected ✅, Masked ❌)
- [ ] `DEPLOY_PATH` (Protected ✅, Masked ❌)
- [ ] `STAGING_PATH` (Protected ❌, Masked ❌)

**Reference:** [`GITLAB_VARIABLES.md`](./GITLAB_VARIABLES.md)

---

### 3. Server Setup

#### A. Initial Server Configuration
- [ ] Server có IP public và accessible
- [ ] OS: Ubuntu 20.04/22.04 hoặc tương đương
- [ ] Root access hoặc sudo privileges

#### B. Install Required Software
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Git installed

**Quick Setup:**
```bash
# Copy script lên server
scp scripts/setup-server.sh user@server:/tmp/

# SSH và chạy
ssh user@server
chmod +x /tmp/setup-server.sh
sudo /tmp/setup-server.sh
```

#### C. Create Deploy User
- [ ] User `deploy` đã được tạo
- [ ] User có quyền sudo
- [ ] User trong group `docker`

```bash
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy
```

---

### 4. SSH Key Setup

- [ ] SSH key pair đã được tạo
  ```bash
  ssh-keygen -t ed25519 -C "deploy@smartlearning" -f ~/.ssh/gitlab_deploy
  ```

- [ ] Public key đã được add vào server
  ```bash
  ssh-copy-id -i ~/.ssh/gitlab_deploy.pub deploy@server-ip
  ```

- [ ] Test SSH connection thành công
  ```bash
  ssh -i ~/.ssh/gitlab_deploy deploy@server-ip
  ```

- [ ] Private key đã được add vào GitLab Variables
  ```bash
  cat ~/.ssh/gitlab_deploy
  # Copy content → GitLab Variables → SSH_PRIVATE_KEY
  ```

---

### 5. Server Directory Structure

- [ ] Production directory đã được tạo
  ```bash
  sudo mkdir -p /var/www/smartlearning
  sudo chown -R deploy:deploy /var/www/smartlearning
  ```

- [ ] Staging directory đã được tạo
  ```bash
  sudo mkdir -p /var/www/smartlearning-staging
  sudo chown -R deploy:deploy /var/www/smartlearning-staging
  ```

- [ ] Repository đã được clone
  ```bash
  # Production
  cd /var/www
  git clone https://gitlab.com/your-username/smartlearning.git smartlearning
  cd smartlearning
  git checkout main
  
  # Staging
  cd /var/www
  git clone https://gitlab.com/your-username/smartlearning.git smartlearning-staging
  cd smartlearning-staging
  git checkout develop
  ```

---

### 6. Environment Files

#### Production (.env)
- [ ] File `.env` đã được tạo ở `/var/www/smartlearning/`
- [ ] Các giá trị đã được cập nhật với production credentials
- [ ] File permissions đã được set (600)
  ```bash
  cd /var/www/smartlearning
  nano .env
  # Paste và cập nhật giá trị
  chmod 600 .env
  ```

#### Staging (.env)
- [ ] File `.env` đã được tạo ở `/var/www/smartlearning-staging/`
- [ ] Các giá trị đã được cập nhật với staging credentials
- [ ] File permissions đã được set (600)

**Template:** Xem file `env.example`

---

### 7. Database Setup

- [ ] PostgreSQL container đã được start
  ```bash
  cd /var/www/smartlearning
  docker-compose -f docker-compose.prod.yml up -d postgres
  ```

- [ ] Database đã được tạo
- [ ] Migrations đã được chạy
  ```bash
  cd backend
  npx prisma migrate deploy
  npx prisma generate
  ```

- [ ] Test database connection
  ```bash
  docker exec -it smartlearning-db-prod psql -U postgres -d smartlearning
  ```

---

### 8. Firewall Configuration

- [ ] UFW đã được cài đặt và enable
- [ ] Các ports cần thiết đã được mở:
  - [ ] Port 22 (SSH)
  - [ ] Port 80 (HTTP)
  - [ ] Port 443 (HTTPS)
  - [ ] Port 3000 (Frontend)
  - [ ] Port 5000 (Backend)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
sudo ufw status
```

---

### 9. GitLab CI/CD Runners

- [ ] Shared Runners đã được enable
  - **Settings → CI/CD → Runners → Enable shared runners**
- [ ] Hoặc Self-hosted Runner đã được setup (optional)

---

### 10. Test Environment

- [ ] Local test đã pass
  ```bash
  ./scripts/test-env.sh
  ```

- [ ] Docker build test local đã pass
  ```bash
  cd backend && docker build -t test-backend .
  cd frontend && docker build -t test-frontend .
  ```

- [ ] GitLab pipeline đã chạy thành công ít nhất 1 lần

---

## 🚀 First Deployment

### Staging Deployment

1. **Push code to develop branch**
   ```bash
   git checkout develop
   git pull origin develop
   git push origin develop
   ```

2. **Check pipeline status**
   - Vào GitLab → CI/CD → Pipelines
   - Chờ pipeline chạy xong
   - Verify all jobs passed

3. **Deploy to staging**
   - Click nút "Play" ở job `deploy:staging`
   - Monitor deployment logs
   - Wait for completion

4. **Verify deployment**
   ```bash
   # SSH vào server
   ssh deploy@server
   
   # Check containers
   cd /var/www/smartlearning-staging
   docker-compose ps
   
   # Check logs
   docker-compose logs -f
   ```

5. **Health check**
   ```bash
   ./scripts/health-check.sh
   curl http://server-ip:3000
   curl http://server-ip:5000/health
   ```

### Production Deployment

1. **Merge develop → main**
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

2. **Create backup**
   ```bash
   ssh deploy@server
   cd /var/www/smartlearning
   ./scripts/deploy.sh backup
   ```

3. **Deploy to production**
   - Vào GitLab → CI/CD → Pipelines
   - Chờ pipeline chạy xong
   - Click "Play" ở job `deploy:production`
   - **Confirm deployment** khi được hỏi

4. **Run migrations** (if needed)
   - Click "Play" ở job `migrate:production`

5. **Verify deployment**
   ```bash
   ssh deploy@server
   cd /var/www/smartlearning
   docker-compose -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.prod.yml logs -f --tail=50
   ```

6. **Health check**
   ```bash
   ./scripts/health-check.sh
   curl https://smartlearning.com
   curl https://api.smartlearning.com/health
   ```

---

## 🔍 Post-Deployment Verification

### Application Health
- [ ] Frontend accessible
- [ ] Backend API responding
- [ ] Database connected
- [ ] Authentication working
- [ ] Email sending working

### Performance Check
- [ ] Page load time acceptable
- [ ] API response time normal
- [ ] Database queries optimized

### Security Check
- [ ] HTTPS working (if configured)
- [ ] Secrets not exposed in logs
- [ ] Environment variables set correctly
- [ ] Firewall rules active

### Monitoring
- [ ] Application logs được monitor
- [ ] Error logs được check
- [ ] Resource usage normal (CPU, Memory, Disk)

---

## 🐛 Troubleshooting

### If Deployment Fails

1. **Check Pipeline Logs**
   ```
   GitLab → CI/CD → Pipelines → [Failed Job] → View logs
   ```

2. **Check Server Logs**
   ```bash
   ssh deploy@server
   docker-compose logs -f
   ```

3. **Rollback if Necessary**
   - Via GitLab: Click job `rollback:production`
   - Via SSH:
     ```bash
     cd /var/www/smartlearning
     git reset --hard HEAD~1
     docker-compose -f docker-compose.prod.yml restart
     ```

---

## 📊 Monitoring Checklist

### Daily
- [ ] Check pipeline status
- [ ] Monitor application logs
- [ ] Check error rates
- [ ] Verify backups

### Weekly
- [ ] Review resource usage
- [ ] Check security alerts
- [ ] Update dependencies (if needed)
- [ ] Test backup restore

### Monthly
- [ ] Rotate secrets
- [ ] Clean old Docker images
- [ ] Review and optimize database
- [ ] Update documentation

---

## 📞 Emergency Contacts

### Rollback Steps
```bash
# Option 1: Via GitLab CI/CD
GitLab → CI/CD → Pipelines → "rollback:production" → Play

# Option 2: Manual
ssh deploy@server
cd /var/www/smartlearning
git reset --hard HEAD~1
docker-compose -f docker-compose.prod.yml restart
```

### Support Resources
- **Team Lead**: Mr. Thiên
- **Documentation**: [`CICD_README.md`](./CICD_README.md)
- **Variables Guide**: [`GITLAB_VARIABLES.md`](./GITLAB_VARIABLES.md)
- **Setup Guide**: [`CI_CD_SETUP.md`](./CI_CD_SETUP.md)

---

## ✅ Final Checklist

### Before Going Live
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Team notified
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Monitoring setup
- [ ] SSL certificate installed (if applicable)
- [ ] Domain DNS configured
- [ ] Health checks passing
- [ ] Performance acceptable

### After Going Live
- [ ] Verify all features working
- [ ] Monitor logs for errors
- [ ] Check performance metrics
- [ ] Notify stakeholders
- [ ] Update status page
- [ ] Document any issues
- [ ] Plan next iteration

---

**Checklist Version**: 1.0.0  
**Last Updated**: 2024-10-20  
**Maintained by**: SmartLearning Team

---

## 📝 Notes

- Checklist này nên được review và update định kỳ
- Print và sử dụng trong mỗi lần deploy
- Customize theo nhu cầu của team
- Keep a deployment log for reference

