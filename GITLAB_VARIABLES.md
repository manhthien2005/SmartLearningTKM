# GitLab CI/CD Variables Configuration

## 📋 Overview
Tài liệu này hướng dẫn cấu hình các biến môi trường cần thiết cho GitLab CI/CD.

## 🔧 Cách Thêm Variables vào GitLab

1. Truy cập repository trên GitLab
2. **Settings** → **CI/CD** → **Variables** → **Expand**
3. Click **Add variable**
4. Điền thông tin và click **Add variable**

---

## 📝 Danh Sách Variables Cần Thiết

### 1. Database Configuration

#### `DATABASE_URL`
- **Type**: Variable
- **Value**: `postgresql://username:password@host:5432/smartlearning`
- **Protected**: ✅ Yes
- **Masked**: ✅ Yes
- **Description**: Connection string cho PostgreSQL database
- **Example**: 
  ```
  postgresql://postgres:MySecurePass123@db.example.com:5432/smartlearning
  ```

---

### 2. JWT & Security

#### `JWT_SECRET`
- **Type**: Variable
- **Value**: Your secure JWT secret key
- **Protected**: ✅ Yes
- **Masked**: ✅ Yes
- **Description**: Secret key để sign JWT tokens
- **Generate**:
  ```bash
  openssl rand -base64 32
  # Output: qE8zNj3xK9mP4vR7wS0tY2uH5jK8lM1nO6pQ3rT4
  ```

---

### 3. Email Configuration

#### `EMAIL_USER`
- **Type**: Variable
- **Value**: `your-email@gmail.com`
- **Protected**: ✅ Yes
- **Masked**: ❌ No
- **Description**: Gmail account để gửi email

#### `EMAIL_PASS`
- **Type**: Variable
- **Value**: Gmail App Password
- **Protected**: ✅ Yes
- **Masked**: ✅ Yes
- **Description**: Gmail App Password (không phải password thường)
- **Generate**:
  1. Google Account → Security
  2. Enable 2-Step Verification
  3. App passwords → Generate
  4. Copy 16-character password

---

### 4. Frontend Configuration

#### `NEXT_PUBLIC_API_URL`
- **Type**: Variable
- **Value**: 
  - Production: `https://api.smartlearning.com`
  - Staging: `https://staging-api.smartlearning.com`
- **Protected**: ❌ No
- **Masked**: ❌ No
- **Description**: Backend API URL cho frontend

#### `FRONTEND_URL`
- **Type**: Variable
- **Value**: 
  - Production: `https://smartlearning.com`
  - Staging: `https://staging.smartlearning.com`
- **Protected**: ❌ No
- **Masked**: ❌ No
- **Description**: Frontend URL

---

### 5. SSH Configuration

#### `SSH_PRIVATE_KEY`
- **Type**: Variable
- **Value**: Private SSH key content
- **Protected**: ✅ Yes
- **Masked**: ✅ Yes
- **Description**: SSH private key để deploy lên server
- **Generate**:
  ```bash
  # Tạo SSH key pair
  ssh-keygen -t ed25519 -C "deploy@smartlearning" -f ~/.ssh/gitlab_deploy
  
  # Copy public key lên server
  ssh-copy-id -i ~/.ssh/gitlab_deploy.pub deploy@your-server-ip
  
  # Copy nội dung private key (paste vào GitLab)
  cat ~/.ssh/gitlab_deploy
  ```
- **Format**:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
  QyNTUxOQAAACBvZ+8... (your key content)
  -----END OPENSSH PRIVATE KEY-----
  ```

#### `SSH_USER`
- **Type**: Variable
- **Value**: `deploy`
- **Protected**: ✅ Yes
- **Masked**: ❌ No
- **Description**: Username để SSH vào server

#### `SSH_HOST`
- **Type**: Variable
- **Value**: `123.456.789.101`
- **Protected**: ✅ Yes
- **Masked**: ❌ No
- **Description**: IP address hoặc domain của server

---

### 6. Deployment Paths

#### `DEPLOY_PATH`
- **Type**: Variable
- **Value**: `/var/www/smartlearning`
- **Protected**: ✅ Yes
- **Masked**: ❌ No
- **Description**: Đường dẫn deploy production trên server

#### `STAGING_PATH`
- **Type**: Variable
- **Value**: `/var/www/smartlearning-staging`
- **Protected**: ❌ No
- **Masked**: ❌ No
- **Description**: Đường dẫn deploy staging trên server

---

### 7. Docker Registry (Optional)

#### `CI_REGISTRY`
- **Type**: Variable
- **Value**: `registry.gitlab.com`
- **Protected**: ❌ No
- **Masked**: ❌ No
- **Description**: Docker registry URL

#### `CI_REGISTRY_USER`
- **Type**: Variable
- **Value**: Your GitLab username
- **Protected**: ✅ Yes
- **Masked**: ❌ No
- **Description**: GitLab username

#### `CI_REGISTRY_PASSWORD`
- **Type**: Variable
- **Value**: GitLab Personal Access Token
- **Protected**: ✅ Yes
- **Masked**: ✅ Yes
- **Description**: GitLab token với quyền `read_registry` và `write_registry`
- **Generate**:
  1. GitLab → User Settings → Access Tokens
  2. Token name: `docker-registry`
  3. Scopes: ✅ `read_registry`, ✅ `write_registry`
  4. Create token
  5. Copy token

---

## 📊 Quick Reference Table

| Variable | Protected | Masked | Required | Environment |
|----------|-----------|--------|----------|-------------|
| `DATABASE_URL` | ✅ | ✅ | ✅ | All |
| `JWT_SECRET` | ✅ | ✅ | ✅ | All |
| `EMAIL_USER` | ✅ | ❌ | ✅ | All |
| `EMAIL_PASS` | ✅ | ✅ | ✅ | All |
| `NEXT_PUBLIC_API_URL` | ❌ | ❌ | ✅ | All |
| `FRONTEND_URL` | ❌ | ❌ | ✅ | All |
| `SSH_PRIVATE_KEY` | ✅ | ✅ | ✅ | Deploy |
| `SSH_USER` | ✅ | ❌ | ✅ | Deploy |
| `SSH_HOST` | ✅ | ❌ | ✅ | Deploy |
| `DEPLOY_PATH` | ✅ | ❌ | ✅ | Production |
| `STAGING_PATH` | ❌ | ❌ | ✅ | Staging |
| `CI_REGISTRY` | ❌ | ❌ | ❌ | Docker |
| `CI_REGISTRY_USER` | ✅ | ❌ | ❌ | Docker |
| `CI_REGISTRY_PASSWORD` | ✅ | ✅ | ❌ | Docker |

---

## 🔐 Security Best Practices

### 1. Protected Variables
- Chỉ available trong protected branches (main, develop)
- Dùng cho production secrets
- Không accessible từ feature branches

### 2. Masked Variables
- Giá trị sẽ bị hidden trong job logs
- Dùng cho passwords, tokens, keys
- Phải match regex: `^[a-zA-Z0-9_]{8,}$`

### 3. File Type Variables
- Dùng cho SSH keys, certificates
- Content được write vào temporary file
- Access qua `$SSH_PRIVATE_KEY` path

### 4. General Security
- ✅ Rotate secrets định kỳ (3-6 tháng)
- ✅ Sử dụng strong passwords
- ✅ Different secrets cho staging/production
- ✅ Review GitLab audit logs thường xuyên
- ❌ Never commit secrets vào Git
- ❌ Never log secrets trong pipeline

---

## 🧪 Testing Variables

### Test Local với Docker
```bash
# Tạo .env file local (KHÔNG commit)
cat > .env << EOF
DATABASE_URL=postgresql://postgres:password@localhost:5432/smartlearning
JWT_SECRET=$(openssl rand -base64 32)
EMAIL_USER=test@example.com
EMAIL_PASS=testpassword
NEXT_PUBLIC_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
EOF

# Test với docker-compose
docker-compose up --build
```

### Verify trong GitLab CI
```yaml
# Thêm job debug (temporary)
debug:variables:
  stage: test
  script:
    - echo "Testing variables (không log giá trị thật)"
    - test -n "$DATABASE_URL" && echo "✓ DATABASE_URL is set"
    - test -n "$JWT_SECRET" && echo "✓ JWT_SECRET is set"
    - test -n "$SSH_PRIVATE_KEY" && echo "✓ SSH_PRIVATE_KEY is set"
  only:
    - develop
  when: manual
```

---

## 🔄 Environment-Specific Variables

### Production Variables
```
DATABASE_URL=postgresql://prod_user:prod_pass@prod-db.com:5432/smartlearning
NEXT_PUBLIC_API_URL=https://api.smartlearning.com
FRONTEND_URL=https://smartlearning.com
```

### Staging Variables
```
DATABASE_URL=postgresql://staging_user:staging_pass@staging-db.com:5432/smartlearning_staging
NEXT_PUBLIC_API_URL=https://staging-api.smartlearning.com
FRONTEND_URL=https://staging.smartlearning.com
```

### Development Variables
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/smartlearning_dev
NEXT_PUBLIC_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

---

## 📞 Support

### Common Issues

#### Issue: "Variable is not set"
**Solution**: Check variable key spelling và scope (Protected branches)

#### Issue: "SSH connection refused"
**Solution**: 
1. Verify `SSH_HOST` is correct
2. Check `SSH_PRIVATE_KEY` format (include headers)
3. Test SSH connection manually:
   ```bash
   ssh -i private_key deploy@server-ip
   ```

#### Issue: "Database connection failed"
**Solution**:
1. Verify `DATABASE_URL` format
2. Check database server is accessible
3. Test connection:
   ```bash
   psql "postgresql://user:pass@host:5432/db"
   ```

---

**Last Updated**: 2024-10-20  
**Maintainer**: SmartLearning Team

