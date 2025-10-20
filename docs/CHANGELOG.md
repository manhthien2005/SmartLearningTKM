# Changelog - FE/BE Separation

## [1.0.0] - 2025-10-11

### 🎯 Major Changes

#### Backend (Node.js + Express)
- ✅ Tạo backend folder với Express server
- ✅ Convert Next.js API routes → Express routes
- ✅ Di chuyển Prisma schema + migrations
- ✅ Implement JWT authentication với Jose
- ✅ Email service với Nodemailer
- ✅ CORS configuration
- ✅ TypeScript support
- ✅ Hot reload với nodemon

#### Frontend (Next.js 14)
- ✅ Tạo frontend folder
- ✅ Di chuyển toàn bộ code FE hiện có (giữ nguyên)
- ✅ Setup Redux Toolkit
- ✅ Setup React Query
- ✅ Setup i18n (vi/en)
- ✅ Axios API client với withCredentials
- ✅ Middleware authentication

### 📦 New Packages

#### Backend
- `express` - Web framework
- `cors` - CORS middleware
- `cookie-parser` - Cookie parsing
- `jose` - JWT handling
- `dotenv` - Environment variables

#### Frontend
- `@reduxjs/toolkit` - State management
- `react-redux` - Redux for React
- `@tanstack/react-query` - Server state
- `axios` - HTTP client
- `next-i18next` - i18n support
- `react-i18next` - i18n hooks

### 🗂️ File Structure

```
SmartLearningTKM/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── lib/
│   ├── i18n/
│   ├── package.json
│   └── tsconfig.json
├── package.json
├── setup.ps1
├── SUMMARY.md
├── MIGRATION_GUIDE.md
└── PROJECT_STRUCTURE.md
```

### 🔄 API Changes

#### Before (Next.js API Routes)
```
app/api/auth/login/route.ts
app/api/auth/register/student/route.ts
```

#### After (Express Routes)
```
backend/src/routes/auth.routes.ts
backend/src/controllers/auth.controller.ts
```

### 🎨 Frontend Integration

#### Redux Store
- **authSlice**: `isLogin`, `user`, `token`
- Actions: `setCredentials`, `logout`, `updateUser`

#### React Query
- **useAuth() hook**:
  - `login()`
  - `registerStudent()`
  - `registerLecturer()`
  - `verifyEmail()`
  - `resendOTP()`
  - `logout()`

#### i18n
- Locales: `vi`, `en`
- Files: `i18n/locales/{vi,en}/common.json`
- Hook: `useTranslation(locale)`

### 📡 API Endpoints

#### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register/student`
- `POST /api/auth/register/lecturer`
- `POST /api/auth/email-verification`
- `POST /api/auth/resend-otp`
- `POST /api/auth/logout`

#### User
- `GET /api/user/trusted-devices`
- `DELETE /api/user/trusted-devices/:device_id`

### 🔐 Security

- JWT với 7 days expiration
- HttpOnly cookies
- CORS configured
- bcrypt password hashing
- OTP email verification
- Trusted devices mechanism

### 🛠️ Development

#### Scripts
```bash
npm run dev                # Chạy cả FE + BE
npm run dev:backend        # Chỉ backend
npm run dev:frontend       # Chỉ frontend
npm run install:all        # Install all dependencies
```

#### Environment Variables
- Backend: `.env`
- Frontend: `.env.local`

### 📝 Documentation

- `SUMMARY.md` - Quick reference
- `MIGRATION_GUIDE.md` - Detailed migration guide
- `PROJECT_STRUCTURE.md` - Project structure
- `backend/README.md` - Backend docs
- `frontend/README.md` - Frontend docs

### ⚠️ Breaking Changes

- API routes moved from `/api/*` to backend server
- Need to run backend and frontend separately
- Environment variables split into 2 files
- Session management now via backend cookies

### 🔄 Migration Path

1. Run `setup.ps1` or `npm run install:all`
2. Configure `.env` files
3. Run `npm run dev` from root
4. Update components to use `useAuth()` hook
5. Replace direct API calls with React Query

### 🐛 Known Issues

None

### 📊 Statistics

- Backend: 10+ files created
- Frontend: 20+ files created
- Total lines: ~2000+ LOC
- Dependencies added: 15+ packages

### 🚀 Future Improvements

- [ ] Add more API endpoints
- [ ] Implement WebSocket for real-time features
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Setup CI/CD
- [ ] Docker containerization
- [ ] API documentation (Swagger)

---

**Author:** AI Assistant  
**Date:** October 11, 2025  
**Version:** 1.0.0


