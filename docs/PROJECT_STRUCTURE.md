# SmartLearning - Cấu trúc dự án mới

Dự án đã được tách thành 2 folder riêng biệt:

## 📁 Cấu trúc thư mục

```
SmartLearningTKM/
├── backend/              # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   ├── utils/        # Utilities
│   │   └── server.ts     # Entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/             # Frontend (Next.js 14)
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks (useAuth, useTranslation)
│   ├── store/           # Redux store + slices
│   ├── lib/             # API clients, providers
│   ├── i18n/            # Translations (vi/en)
│   ├── middleware.ts
│   ├── package.json
│   └── tsconfig.json
│
└── PROJECT_STRUCTURE.md  # File này
```

## 🚀 Setup & Chạy dự án

### 1. Backend Setup

```bash
cd backend
npm install

# Tạo file .env
# DATABASE_URL=postgresql://user:password@localhost:5432/smartlearning
# JWT_SECRET=your-secret-key
# PORT=5000
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# FRONTEND_URL=http://localhost:3000

# Generate Prisma Client & Migrate
npm run prisma:generate
npm run prisma:migrate

# Chạy backend
npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend
npm install

# Tạo file .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Chạy frontend
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

## 🔧 Tech Stack

### Backend
- **Node.js** + **Express** - Web server
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Jose** - JWT authentication
- **Nodemailer** - Email service
- **bcrypt** - Password hashing

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Query** - Server state
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **i18n** - Internationalization (vi/en)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register/student` - Đăng ký sinh viên
- `POST /api/auth/register/lecturer` - Đăng ký giảng viên
- `POST /api/auth/email-verification` - Xác thực email
- `POST /api/auth/resend-otp` - Gửi lại OTP
- `POST /api/auth/logout` - Đăng xuất

### User
- `GET /api/user/trusted-devices` - Lấy thiết bị tin cậy
- `DELETE /api/user/trusted-devices/:device_id` - Xóa thiết bị

## 🎯 Features đã implement

### Redux Store
- **authSlice**: Quản lý auth state
  - `isLogin`: Boolean
  - `user`: User object
  - `token`: JWT token (optional)

### React Query
- **useAuth()** hook với các methods:
  - `login()` - Đăng nhập
  - `registerStudent()` - Đăng ký SV
  - `registerLecturer()` - Đăng ký GV
  - `verifyEmail()` - Xác thực OTP
  - `resendOTP()` - Gửi lại OTP
  - `logout()` - Đăng xuất

### i18n
- Hỗ trợ 2 ngôn ngữ: **Tiếng Việt** (vi) và **English** (en)
- File translations: `frontend/i18n/locales/{vi|en}/common.json`

### CORS & Authentication
- Backend đã cấu hình CORS cho frontend
- Cookies-based authentication
- JWT với thời hạn 7 ngày
- Trusted devices (ghi nhớ thiết bị)

## 🔐 Security
- Passwords: bcrypt hashing
- JWT: Jose library
- HTTP-only cookies
- CORS configured
- Input validation
- OTP email verification

## 📝 Notes

### Code FE được giữ nguyên
- Toàn bộ components, pages, styles đã được copy sang `frontend/`
- Không có thay đổi logic, chỉ thêm integration layers

### Backend API
- Chuyển từ Next.js API routes sang Express
- Logic xử lý giữ nguyên
- Database schema không thay đổi

### Kết nối FE-BE
- Frontend proxy API requests qua Next.js rewrites
- Axios client với `withCredentials: true`
- Session cookies được chia sẻ giữa FE và BE

## 🐛 Troubleshooting

### CORS errors?
Kiểm tra `FRONTEND_URL` trong backend `.env` khớp với URL frontend

### Database connection failed?
Kiểm tra `DATABASE_URL` trong backend `.env` và database đã chạy

### Cannot find module?
Chạy `npm install` trong cả backend và frontend

### Session not persisting?
Kiểm tra cookies settings và domain configuration


