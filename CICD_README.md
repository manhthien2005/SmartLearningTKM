# 🚀 GitLab CI/CD Setup - SmartLearning Platform

## 📖 Tổng Quan

Dự án SmartLearning sử dụng GitLab CI/CD để tự động hóa:
- ✅ Install dependencies
- ✅ Lint code
- ✅ Build application
- ✅ Run tests
- ✅ Deploy to staging/production
- ✅ Database migrations
- ✅ Rollback capabilities

---

## 📁 Files Structure

```
SmartLearningTKM/
├── .gitlab-ci.yml                    # Main CI/CD pipeline config
├── CI_CD_SETUP.md                    # Detailed setup guide
├── GITLAB_VARIABLES.md               # Variables configuration guide
├── CICD_README.md                    # This file
├── .gitlab/
│   ├── issue_templates/
│   │   └── bug.md                    # Bug report template
│   └── merge_request_templates/
│       └── default.md                # MR template
├── scripts/
│   ├── deploy.sh                     # Deployment script
│   ├── setup-server.sh               # Server setup script
│   ├── health-check.sh               # Health check script
│   └── test-env.sh                   # Environment test script
└── docs/
    └── GITLAB_CI_CD_SETUP.md         # Original setup guide
```

---

## 🚀 Quick Start

### 1️⃣ Setup GitLab Repository

```bash
# Initialize Git (if not already)
git init

# Add GitLab remote
git remote add origin https://gitlab.com/your-username/smartlearning.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Setup CI/CD"

# Push to GitLab
git push -u origin main
```

### 2️⃣ Configure CI/CD Variables

**Xem chi tiết trong:** [`GITLAB_VARIABLES.md`](./GITLAB_VARIABLES.md)

**Bắt buộc:**
- `DATABASE_URL`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `NEXT_PUBLIC_API_URL`

**Cho Deployment:**
- `SSH_PRIVATE_KEY`
- `SSH_USER`
- `SSH_HOST`
- `DEPLOY_PATH`
- `STAGING_PATH`

### 3️⃣ Setup Server

**Option A: Tự động**
```bash
# Copy script lên server
scp scripts/setup-server.sh user@server:/tmp/

# SSH vào server và chạy
ssh user@server
chmod +x /tmp/setup-server.sh
sudo /tmp/setup-server.sh
```

**Option B: Manual**
Xem chi tiết trong [`CI_CD_SETUP.md`](./CI_CD_SETUP.md)

### 4️⃣ Test Environment

```bash
# Test locally
./scripts/test-env.sh

# Make scripts executable
chmod +x scripts/*.sh
```

### 5️⃣ Trigger First Pipeline

```bash
# Push code to trigger pipeline
git push origin main

# Or create merge request
git checkout -b feature/test
git push origin feature/test
# Tạo MR trên GitLab UI
```

---

## 🔄 CI/CD Pipeline Stages

### Stage 1: Install
- Install root dependencies
- Install backend dependencies
- Install frontend dependencies
- Cache node_modules

### Stage 2: Lint
- **lint:frontend** - ESLint check
- **lint:backend** - TypeScript type check

### Stage 3: Build
- **build:backend** - TypeScript compilation + Prisma generate
- **build:frontend** - Next.js build

### Stage 4: Test
- **test:type-check** - TypeScript validation

### Stage 5: Deploy (Manual)
- **deploy:staging** - Deploy to staging (branch: develop)
- **deploy:production** - Deploy to production (branch: main)
- **migrate:production** - Run database migrations
- **rollback:production** - Rollback deployment

---

## 🌿 Branch Strategy

### Main Branches
```
main (production)
  ↑
develop (staging)
  ↑
feature/* (development)
```

### Workflow
1. **Feature Development**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   # ... code changes ...
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Create Merge Request**
   - Target: `develop` branch
   - Pipeline sẽ chạy tự động
   - Review code và merge

3. **Deploy to Staging**
   - Merge vào `develop`
   - Pipeline chạy
   - Click "Play" ở job `deploy:staging`

4. **Deploy to Production**
   - Merge `develop` → `main`
   - Pipeline chạy
   - Click "Play" ở job `deploy:production`

---

## 🛠️ Available Scripts

### Deploy Script
```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production

# View logs
./scripts/deploy.sh logs production

# Health check
./scripts/deploy.sh health

# Rollback
./scripts/deploy.sh rollback production

# Backup database
./scripts/deploy.sh backup
```

### Health Check Script
```bash
# Check application health
./scripts/health-check.sh
```

### Environment Test Script
```bash
# Test environment variables
./scripts/test-env.sh
```

---

## 🔍 Monitoring & Debugging

### View Pipeline Status
1. GitLab → **CI/CD** → **Pipelines**
2. Click vào pipeline để xem details
3. Click vào job để xem logs

### View Job Logs
```bash
# Trên GitLab UI
CI/CD → Pipelines → [Pipeline] → [Job] → View logs

# Trên server
docker-compose logs -f
docker-compose logs backend
docker-compose logs frontend
```

### Common Commands
```bash
# Check containers
docker ps

# View container logs
docker logs smartlearning-backend-prod

# Enter container
docker exec -it smartlearning-backend-prod sh

# Check database
docker exec -it smartlearning-db-prod psql -U postgres -d smartlearning
```

---

## 🐛 Troubleshooting

### Pipeline Failed

**1. Install Stage Failed**
```bash
# Clear cache
GitLab → CI/CD → Pipelines → Clear runner cache

# Update lock files
npm install
git add package-lock.json */package-lock.json
git commit -m "chore: update lock files"
git push
```

**2. Build Stage Failed**
```bash
# Check environment variables
# Verify NEXT_PUBLIC_API_URL is set

# Test build locally
cd backend && npm run build
cd frontend && npm run build
```

**3. Deploy Stage Failed**
```bash
# Test SSH connection
ssh -i ~/.ssh/gitlab_deploy deploy@server-ip

# Check server logs
ssh deploy@server "cd /var/www/smartlearning && docker-compose logs"
```

### Application Not Working After Deploy

**Check Health**
```bash
# Run health check
./scripts/health-check.sh

# Or manually
curl http://localhost:5000/health
curl http://localhost:3000
```

**Check Logs**
```bash
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

**Restart Services**
```bash
docker-compose -f docker-compose.prod.yml restart
```

---

## 📊 Performance Tips

### 1. Cache Optimization
- Pipeline sử dụng cache cho `node_modules`
- Cache key based on `package-lock.json`

### 2. Parallel Jobs
- Lint jobs chạy parallel
- Build jobs chạy parallel

### 3. Artifacts
- Build artifacts expire sau 1 hour
- Only store necessary files

### 4. Docker Layer Caching
- Multi-stage builds
- Optimize layer order

---

## 🔒 Security Checklist

- [ ] All secrets stored in GitLab Variables
- [ ] Protected variables enabled for sensitive data
- [ ] Masked variables for passwords/tokens
- [ ] SSH keys properly configured
- [ ] Firewall configured on server
- [ ] Database credentials rotated regularly
- [ ] HTTPS enabled (production)
- [ ] Regular security updates

---

## 📋 Deployment Checklist

### Before First Deployment
- [ ] GitLab repository created
- [ ] CI/CD variables configured
- [ ] Server setup completed
- [ ] SSH keys configured
- [ ] Database created
- [ ] Environment files created
- [ ] Scripts made executable
- [ ] Test environment variables

### Before Each Deployment
- [ ] Code reviewed and approved
- [ ] Tests passing
- [ ] Database migrations tested
- [ ] Backup created
- [ ] Team notified
- [ ] Rollback plan ready

### After Deployment
- [ ] Health check passed
- [ ] Application accessible
- [ ] Database migrations successful
- [ ] Logs monitored
- [ ] Performance checked
- [ ] Team notified

---

## 📚 Additional Resources

### Documentation
- [CI/CD Setup Guide](./CI_CD_SETUP.md) - Chi tiết setup
- [GitLab Variables Guide](./GITLAB_VARIABLES.md) - Cấu hình variables
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/) - Official docs
- [Docker Documentation](https://docs.docker.com/) - Docker guides

### Internal Docs
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Features Documentation](./docs/FEATURES.md)
- [Migration Guide](./docs/MIGRATION_GUIDE.md)

---

## 🤝 Contributing

### Create Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
# ... make changes ...
git commit -m "feat: your feature"
git push origin feature/your-feature
```

### Create Merge Request
1. Vào GitLab UI
2. **Merge Requests** → **New merge request**
3. Source: `feature/your-feature`
4. Target: `develop`
5. Fill template
6. Assign reviewers
7. Submit

### Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting, missing semicolons, etc
refactor: code restructuring
test: adding tests
chore: updating build tasks, package manager configs, etc
```

---

## 📞 Support

### Contact
- **Team Lead**: Mr. Thiên
- **Repository**: https://gitlab.com/your-username/smartlearning
- **Issues**: GitLab Issues
- **CI/CD Help**: Check troubleshooting section

### Emergency Rollback
```bash
# Via GitLab CI/CD
CI/CD → Pipelines → Click "rollback:production"

# Via SSH
ssh deploy@server
cd /var/www/smartlearning
git reset --hard HEAD~1
docker-compose -f docker-compose.prod.yml restart
```

---

## 📅 Maintenance Schedule

### Daily
- Monitor pipeline status
- Check application logs
- Review error reports

### Weekly
- Review security alerts
- Update dependencies (if needed)
- Check disk space and resources

### Monthly
- Rotate secrets
- Review and clean old docker images
- Update documentation
- Performance review

---

**Version**: 1.0.0  
**Last Updated**: 2024-10-20  
**Maintained by**: SmartLearning Team

