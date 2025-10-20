# 📚 GitLab CI/CD - Index Tài Liệu

## 🗂️ Tổng Quan Files

### 📄 Tài Liệu Chính

| File | Mô Tả | Độ Ưu Tiên | Thời Gian Đọc |
|------|-------|------------|---------------|
| **[QUICK_START_CICD.md](./QUICK_START_CICD.md)** | Setup nhanh 15 phút | 🔴 Cao | 5 min |
| **[GITLAB_SETUP_SUMMARY.md](./GITLAB_SETUP_SUMMARY.md)** | Tổng quan toàn bộ setup | 🔴 Cao | 10 min |
| **[GITLAB_VARIABLES.md](./GITLAB_VARIABLES.md)** | Chi tiết cấu hình variables | 🟠 Trung Bình | 15 min |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Checklist trước deploy | 🔴 Cao | 10 min |
| **[CICD_README.md](./CICD_README.md)** | Hướng dẫn đầy đủ | 🟠 Trung Bình | 20 min |
| **[CI_CD_SETUP.md](./CI_CD_SETUP.md)** | Setup chi tiết từng bước | 🟡 Thấp | 30 min |

### ⚙️ Files Cấu Hình

| File | Mục Đích | Vị Trí |
|------|----------|--------|
| **[.gitlab-ci.yml](./.gitlab-ci.yml)** | Pipeline configuration | Root |
| **[.gitattributes](./.gitattributes)** | Git attributes | Root |
| **[docker-compose.yml](./docker-compose.yml)** | Development compose | Root |
| **[docker-compose.prod.yml](./docker-compose.prod.yml)** | Production compose | Root |

### 🛠️ Scripts

| Script | Mục Đích | Sử Dụng |
|--------|----------|---------|
| **[deploy.sh](./scripts/deploy.sh)** | Deployment script | `./scripts/deploy.sh [staging\|production]` |
| **[setup-server.sh](./scripts/setup-server.sh)** | Server setup | `sudo ./scripts/setup-server.sh` |
| **[health-check.sh](./scripts/health-check.sh)** | Health check | `./scripts/health-check.sh` |
| **[test-env.sh](./scripts/test-env.sh)** | Test environment | `./scripts/test-env.sh` |

**Chi tiết:** [scripts/README.md](./scripts/README.md)

### 📝 Templates

| Template | Mục Đích | Vị Trí |
|----------|----------|--------|
| **[Bug Template](./.gitlab/issue_templates/bug.md)** | Bug reports | `.gitlab/issue_templates/` |
| **[MR Template](./.gitlab/merge_request_templates/default.md)** | Merge requests | `.gitlab/merge_request_templates/` |

---

## 🚀 Hướng Dẫn Sử Dụng Theo Tình Huống

### 🆕 Lần Đầu Setup CI/CD

**Đọc theo thứ tự:**
1. **[QUICK_START_CICD.md](./QUICK_START_CICD.md)** - Bắt đầu nhanh
2. **[GITLAB_VARIABLES.md](./GITLAB_VARIABLES.md)** - Setup variables
3. **[GITLAB_SETUP_SUMMARY.md](./GITLAB_SETUP_SUMMARY.md)** - Overview
4. **[CI_CD_SETUP.md](./CI_CD_SETUP.md)** - Chi tiết nếu cần

**Ước tính thời gian:** 30-45 phút

---

### 🔧 Đã Có CI/CD, Cần Deploy

**Đọc:**
1. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist
2. **[scripts/README.md](./scripts/README.md)** - Scripts guide
3. **[CICD_README.md](./CICD_README.md)** - Deployment workflow

**Ước tính thời gian:** 15-20 phút

---

### 🐛 Gặp Vấn Đề

**Đọc phần troubleshooting trong:**
1. **[CICD_README.md](./CICD_README.md)** - Troubleshooting
2. **[CI_CD_SETUP.md](./CI_CD_SETUP.md)** - Common issues
3. **[scripts/README.md](./scripts/README.md)** - Script issues

---

### 📊 Hiểu Pipeline

**Đọc:**
1. **[.gitlab-ci.yml](./.gitlab-ci.yml)** - Pipeline config
2. **[CICD_README.md](./CICD_README.md)** - Pipeline stages
3. **[GITLAB_SETUP_SUMMARY.md](./GITLAB_SETUP_SUMMARY.md)** - Pipeline overview

---

## 🎯 Quick Reference

### Commands Thường Dùng

```bash
# Deployment
./scripts/deploy.sh staging
./scripts/deploy.sh production

# Health check
./scripts/health-check.sh

# Test environment
./scripts/test-env.sh

# View logs
./scripts/deploy.sh logs production
docker-compose logs -f
```

### GitLab Paths

```
Settings → CI/CD → Variables       # Add variables
CI/CD → Pipelines                  # View pipelines
Settings → CI/CD → Runners         # Manage runners
Repository → Branches              # Protect branches
```

---

## 📖 Workflow Documents

### Development Workflow

```
Feature → Develop → Staging → Main → Production
```

**Relevant docs:**
- [CICD_README.md](./CICD_README.md) - Workflow section
- [GITLAB_SETUP_SUMMARY.md](./GITLAB_SETUP_SUMMARY.md) - Branch strategy

### Deployment Workflow

```
Code Push → Pipeline → Tests → Manual Deploy
```

**Relevant docs:**
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [CI_CD_SETUP.md](./CI_CD_SETUP.md) - Deployment section

---

## 🔍 Documents by Topic

### Setup & Configuration
- [QUICK_START_CICD.md](./QUICK_START_CICD.md)
- [GITLAB_VARIABLES.md](./GITLAB_VARIABLES.md)
- [CI_CD_SETUP.md](./CI_CD_SETUP.md)
- [.gitlab-ci.yml](./.gitlab-ci.yml)

### Deployment
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [CICD_README.md](./CICD_README.md)
- [scripts/README.md](./scripts/README.md)
- [scripts/deploy.sh](./scripts/deploy.sh)

### Maintenance
- [scripts/health-check.sh](./scripts/health-check.sh)
- [scripts/test-env.sh](./scripts/test-env.sh)
- [CICD_README.md](./CICD_README.md) - Monitoring section

### Troubleshooting
- [CICD_README.md](./CICD_README.md) - Troubleshooting
- [CI_CD_SETUP.md](./CI_CD_SETUP.md) - Troubleshooting
- [scripts/README.md](./scripts/README.md) - Script issues

---

## 📁 File Structure

```
SmartLearningTKM/
│
├── CI/CD Documentation
│   ├── QUICK_START_CICD.md          ⭐ Start here
│   ├── GITLAB_SETUP_SUMMARY.md      ⭐ Overview
│   ├── GITLAB_VARIABLES.md          📝 Variables
│   ├── DEPLOYMENT_CHECKLIST.md      ✅ Checklist
│   ├── CICD_README.md               📖 Full guide
│   ├── CI_CD_SETUP.md               📚 Detailed
│   └── CICD_INDEX.md                📑 This file
│
├── Configuration Files
│   ├── .gitlab-ci.yml               ⚙️ Pipeline
│   ├── .gitattributes               📄 Git config
│   ├── docker-compose.yml           🐳 Dev
│   └── docker-compose.prod.yml      🐳 Prod
│
├── Scripts
│   ├── README.md                    📖 Scripts guide
│   ├── deploy.sh                    🚀 Deploy
│   ├── setup-server.sh              🔧 Setup
│   ├── health-check.sh              💊 Health
│   └── test-env.sh                  🧪 Test
│
└── Templates
    └── .gitlab/
        ├── issue_templates/
        │   └── bug.md               🐛 Bug report
        └── merge_request_templates/
            └── default.md           🔀 MR template
```

---

## 🎓 Learning Path

### Beginner (Mới bắt đầu)
1. ⭐ [QUICK_START_CICD.md](./QUICK_START_CICD.md)
2. ⭐ [GITLAB_SETUP_SUMMARY.md](./GITLAB_SETUP_SUMMARY.md)
3. 📝 [GITLAB_VARIABLES.md](./GITLAB_VARIABLES.md)

### Intermediate (Đã setup cơ bản)
1. 📖 [CICD_README.md](./CICD_README.md)
2. ✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. 📖 [scripts/README.md](./scripts/README.md)

### Advanced (Cần hiểu sâu)
1. 📚 [CI_CD_SETUP.md](./CI_CD_SETUP.md)
2. ⚙️ [.gitlab-ci.yml](./.gitlab-ci.yml)
3. 🔧 Customize scripts

---

## 💡 Tips

### Đọc Hiệu Quả
- ⭐ = Must read
- 📝 = Reference when needed
- 📖 = Read when have time
- 📚 = Deep dive

### Thời Gian Đọc
- Quick start: **5-10 min**
- Overview: **10-15 min**
- Full guide: **30-45 min**
- Deep dive: **1-2 hours**

### Best Practice
1. Start với QUICK_START
2. Reference VARIABLES khi setup
3. Use CHECKLIST trước deploy
4. Read FULL GUIDE khi có thời gian

---

## 🔗 External Resources

### GitLab Documentation
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [GitLab Variables](https://docs.gitlab.com/ee/ci/variables/)
- [GitLab Runners](https://docs.gitlab.com/runner/)

### Docker Documentation
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Other Tools
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deploy](https://www.prisma.io/docs/guides/deployment)

---

## 📞 Need Help?

### Quick Navigation
1. **Just starting?** → [QUICK_START_CICD.md](./QUICK_START_CICD.md)
2. **Need overview?** → [GITLAB_SETUP_SUMMARY.md](./GITLAB_SETUP_SUMMARY.md)
3. **Setting variables?** → [GITLAB_VARIABLES.md](./GITLAB_VARIABLES.md)
4. **Before deploy?** → [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
5. **Something broke?** → Troubleshooting sections
6. **Scripts help?** → [scripts/README.md](./scripts/README.md)

### Contact
- **Team Lead**: Mr. Thiên
- **Issues**: GitLab Issues
- **Emergency**: Check rollback procedures

---

## 🔄 Document Updates

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-10-20 | Initial CI/CD documentation |

---

## ✅ Getting Started Checklist

- [ ] Read [QUICK_START_CICD.md](./QUICK_START_CICD.md)
- [ ] Setup GitLab repository
- [ ] Configure [Variables](./GITLAB_VARIABLES.md)
- [ ] Test pipeline
- [ ] Read [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [ ] Setup server
- [ ] Deploy to staging
- [ ] Deploy to production

---

**Happy Deploying! 🚀**

*Maintained by: SmartLearning Team*  
*Last Updated: 2024-10-20*

