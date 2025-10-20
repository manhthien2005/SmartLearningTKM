# ⚡ Quick Start - GitLab CI/CD

## 🎯 Mục Tiêu
Hướng dẫn nhanh để setup CI/CD trong **15 phút**.

---

## ✅ Checklist Nhanh

### Bước 1: Push Code lên GitLab (2 phút)

```bash
# Thêm GitLab remote
git remote add origin https://gitlab.com/your-username/smartlearning.git

# Push code
git add .
git commit -m "feat: setup CI/CD"
git push -u origin main

# Tạo develop branch
git checkout -b develop
git push -u origin develop
```

---

### Bước 2: Setup Variables (5 phút)

**Vào:** GitLab → Settings → CI/CD → Variables

**Add Variables:**

#### Minimum Required (để pipeline chạy):
```env
DATABASE_URL=postgresql://user:pass@host:5432/smartlearning
JWT_SECRET=<generate với: openssl rand -base64 32>
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=<gmail app password>
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Tất cả set:**
- Protected: ✅ Yes
- Masked: ✅ Yes (trừ EMAIL_USER và NEXT_PUBLIC_API_URL)

#### Deployment Variables (thêm sau khi có server):
```env
SSH_PRIVATE_KEY=<your private key>
SSH_USER=deploy
SSH_HOST=<server ip>
DEPLOY_PATH=/var/www/smartlearning
STAGING_PATH=/var/www/smartlearning-staging
```

---

### Bước 3: Test Pipeline (3 phút)

```bash
# Trigger pipeline
git checkout develop
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger pipeline"
git push origin develop
```

**Kiểm tra:**
1. Vào GitLab → CI/CD → Pipelines
2. Xem pipeline đang chạy
3. Chờ pipeline xanh (passed)

---

### Bước 4: Setup Server (5 phút - optional)

**Nếu muốn deploy ngay:**

```bash
# Copy script lên server
scp scripts/setup-server.sh user@server:/tmp/

# SSH và chạy
ssh user@server
chmod +x /tmp/setup-server.sh
sudo /tmp/setup-server.sh
```

---

## 🎉 Xong!

Pipeline đã sẵn sàng. Mỗi lần push code:
- ✅ Tự động install dependencies
- ✅ Tự động lint code
- ✅ Tự động build
- ✅ Tự động test

---

## 🚀 Next: Deploy to Server

### Setup SSH (nếu chưa có):

```bash
# Tạo SSH key
ssh-keygen -t ed25519 -C "deploy@smartlearning" -f ~/.ssh/gitlab_deploy

# Copy public key lên server
ssh-copy-id -i ~/.ssh/gitlab_deploy.pub deploy@server-ip

# Copy private key vào GitLab Variables
cat ~/.ssh/gitlab_deploy
# → Copy → GitLab Variables → SSH_PRIVATE_KEY
```

### Deploy:

```bash
# Push to develop
git push origin develop

# Vào GitLab → CI/CD → Pipelines
# Click "Play" ở job "deploy:staging"
```

---

## 📖 Chi Tiết Hơn?

| Document | Khi nào đọc |
|----------|-------------|
| [`GITLAB_SETUP_SUMMARY.md`](./GITLAB_SETUP_SUMMARY.md) | Tổng quan setup |
| [`GITLAB_VARIABLES.md`](./GITLAB_VARIABLES.md) | Chi tiết variables |
| [`CI_CD_SETUP.md`](./CI_CD_SETUP.md) | Setup đầy đủ |
| [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) | Trước khi deploy |
| [`scripts/README.md`](./scripts/README.md) | Hướng dẫn scripts |

---

## 🐛 Gặp Lỗi?

### Pipeline Failed?

```bash
# Check logs
GitLab → CI/CD → Pipelines → [Failed Job] → View logs

# Common fixes:
# 1. Clear cache: CI/CD → Pipelines → Clear runner caches
# 2. Update lock files:
npm install
git add */package-lock.json
git commit -m "chore: update lock files"
git push
```

### Variables Not Working?

```bash
# Test locally
./scripts/test-env.sh

# Check GitLab:
# Settings → CI/CD → Variables
# Verify all required variables are set
```

---

## 💡 Tips

1. **Test trên staging trước** khi deploy production
2. **Monitor pipeline** sau mỗi push
3. **Check logs** khi có lỗi
4. **Backup database** trước khi deploy production
5. **Use manual deploy** cho production

---

## 🆘 Quick Help

| Issue | Solution |
|-------|----------|
| Pipeline không chạy | Enable shared runners: Settings → CI/CD → Runners |
| SSH fails | Check SSH_PRIVATE_KEY format, test connection |
| Build fails | Check NEXT_PUBLIC_API_URL variable |
| Can't deploy | Add deployment variables |

---

## ⏱️ Time Summary

- ✅ Push code: **2 min**
- ✅ Setup variables: **5 min**
- ✅ Test pipeline: **3 min**
- ✅ Setup server: **5 min** (optional)
- **Total: 15 minutes** ⚡

---

**Ready?** Start với [Bước 1](#bước-1-push-code-lên-gitlab-2-phút) ⬆️

