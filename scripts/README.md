# 🛠️ Scripts Documentation

## 📋 Overview

Thư mục này chứa các helper scripts để hỗ trợ deployment và maintenance của SmartLearning Platform.

---

## 📂 Available Scripts

### 1. `deploy.sh`
**Purpose:** Main deployment script

**Usage:**
```bash
./scripts/deploy.sh [command] [environment]
```

**Commands:**
- `staging` - Deploy to staging environment
- `production` - Deploy to production environment
- `logs [env]` - View application logs
- `health` - Run health check
- `rollback [env]` - Rollback deployment
- `backup` - Backup database

**Examples:**
```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production (will ask for confirmation)
./scripts/deploy.sh production

# View production logs
./scripts/deploy.sh logs production

# Run health check
./scripts/deploy.sh health

# Backup database
./scripts/deploy.sh backup

# Rollback production
./scripts/deploy.sh rollback production
```

**Requirements:**
- Docker installed
- Docker Compose installed
- Proper permissions

---

### 2. `setup-server.sh`
**Purpose:** Initial server setup script

**Usage:**
```bash
sudo ./scripts/setup-server.sh
```

**What it does:**
- Updates system packages
- Installs Docker
- Installs Docker Compose
- Creates deploy user
- Creates deployment directories
- Configures firewall
- Installs additional tools

**Requirements:**
- Ubuntu 20.04/22.04 or similar
- Root or sudo access
- Internet connection

**Example:**
```bash
# On server
chmod +x /tmp/setup-server.sh
sudo /tmp/setup-server.sh
```

---

### 3. `health-check.sh`
**Purpose:** Check application health status

**Usage:**
```bash
./scripts/health-check.sh
```

**What it checks:**
- Docker status
- Container status (backend, frontend, postgres)
- Backend API health endpoint
- Frontend accessibility
- Database connection
- Disk space
- Memory usage
- Container resource usage

**Example Output:**
```
========================================
SmartLearning Health Check
========================================

[CHECK] Checking Docker...
✓ Docker is running

[CHECK] Checking containers...
✓ Backend container is running
✓ Frontend container is running
✓ PostgreSQL container is running

[CHECK] Checking Backend API...
✓ Backend API is responding
  Response: {"status":"ok"}

[CHECK] Checking Frontend...
✓ Frontend is responding

[CHECK] Checking Database connection...
✓ Database is accessible

[CHECK] Checking disk space...
✓ Disk usage: 45%

[CHECK] Checking memory...
✓ Memory usage: 62%

========================================
Health check completed
========================================
```

---

### 4. `test-env.sh`
**Purpose:** Test environment variables configuration

**Usage:**
```bash
./scripts/test-env.sh
```

**What it checks:**
- All required variables are set
- Variables don't contain placeholder values
- DATABASE_URL format is valid
- JWT_SECRET length is sufficient
- EMAIL_USER format is valid
- URL formats are valid

**Example:**
```bash
# Test with .env file
./scripts/test-env.sh

# Test with exported variables
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export JWT_SECRET="my-secret-key"
./scripts/test-env.sh
```

---

## 🔧 Setup Scripts for Linux/Mac

### Make Scripts Executable

```bash
# All scripts at once
chmod +x scripts/*.sh

# Individual scripts
chmod +x scripts/deploy.sh
chmod +x scripts/setup-server.sh
chmod +x scripts/health-check.sh
chmod +x scripts/test-env.sh
```

---

## 🪟 Windows Users

### Using Git Bash

```bash
# Run scripts with bash
bash scripts/deploy.sh staging
bash scripts/test-env.sh
bash scripts/health-check.sh
```

### Using WSL (Windows Subsystem for Linux)

```bash
# Same as Linux
./scripts/deploy.sh staging
./scripts/test-env.sh
./scripts/health-check.sh
```

---

## 🔐 Security Notes

### SSH Access
Scripts use SSH to connect to servers. Ensure:
- SSH keys are properly configured
- Private keys have proper permissions (600)
- Known hosts file is populated

```bash
# Setup SSH key permissions
chmod 600 ~/.ssh/gitlab_deploy

# Add server to known hosts
ssh-keyscan -H server-ip >> ~/.ssh/known_hosts
```

### Environment Variables
Scripts load `.env` file if available. Ensure:
- `.env` file has proper permissions (600)
- Never commit `.env` to Git
- Use different `.env` for different environments

```bash
# Set proper permissions
chmod 600 .env
```

---

## 🐛 Troubleshooting

### Issue: "Permission denied"

**Solution:**
```bash
# Make script executable
chmod +x scripts/script-name.sh

# Or run with bash
bash scripts/script-name.sh
```

### Issue: "command not found"

**Solution:**
```bash
# Install missing dependencies
# For Docker:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# For Docker Compose:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Issue: "Connection refused"

**Solution:**
```bash
# Check SSH connection
ssh user@server

# Check if Docker is running
docker ps

# Check if services are up
docker-compose ps
```

---

## 📊 Script Dependencies

### deploy.sh
- Docker
- Docker Compose
- Git
- SSH (for remote deployment)

### setup-server.sh
- Ubuntu/Debian-based system
- apt package manager
- sudo privileges

### health-check.sh
- Docker
- curl
- Containers running

### test-env.sh
- bash
- .env file or exported variables

---

## 🔄 Integration with CI/CD

Scripts có thể được gọi từ GitLab CI/CD pipeline:

```yaml
deploy:production:
  script:
    - ssh deploy@server "cd /var/www/smartlearning && ./scripts/deploy.sh production"
    - ssh deploy@server "cd /var/www/smartlearning && ./scripts/health-check.sh"
```

Hoặc chạy trực tiếp trên server sau khi SSH:

```bash
ssh deploy@server
cd /var/www/smartlearning
./scripts/deploy.sh production
./scripts/health-check.sh
```

---

## 📝 Customization

Bạn có thể customize scripts theo nhu cầu:

1. **Edit scripts** với text editor:
   ```bash
   nano scripts/deploy.sh
   ```

2. **Add new scripts** vào thư mục này

3. **Update documentation** trong file này

4. **Test thoroughly** trước khi sử dụng trong production

---

## 🧪 Testing Scripts

### Test Locally

```bash
# Dry run (nếu script support)
./scripts/deploy.sh --dry-run staging

# Test với staging environment
./scripts/deploy.sh staging
./scripts/health-check.sh
```

### Test in CI/CD

```bash
# Add test job to .gitlab-ci.yml
test:scripts:
  stage: test
  script:
    - bash -n scripts/deploy.sh  # Syntax check
    - bash -n scripts/health-check.sh
    - bash -n scripts/test-env.sh
```

---

## 📋 Best Practices

1. **Always test scripts** trên staging trước production
2. **Review script output** để catch errors sớm
3. **Keep scripts simple** và easy to understand
4. **Document changes** khi modify scripts
5. **Use version control** để track changes
6. **Backup before running** critical scripts
7. **Have rollback plan** ready

---

## 📞 Support

### Need Help?

1. **Check script output** cho error messages
2. **Review logs** trong `/var/log/` hoặc docker logs
3. **Test manually** các commands trong script
4. **Check permissions** của scripts và files
5. **Verify environment** variables và configuration

### Common Issues

| Issue | Check | Solution |
|-------|-------|----------|
| Script fails | Permissions | `chmod +x script.sh` |
| Command not found | Dependencies | Install required tools |
| Connection refused | Network | Check SSH/Docker |
| Environment error | Variables | Run `test-env.sh` |

---

## 📚 Additional Resources

- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)
- [Docker Documentation](https://docs.docker.com/)
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/)

---

**Last Updated**: 2024-10-20  
**Maintainer**: SmartLearning Team

