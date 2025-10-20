# SmartLearning Backend API

Backend API cho SmartLearning platform sử dụng Node.js, Express, và Prisma.

## Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/smartlearning
JWT_SECRET=your-jwt-secret-key-here
PORT=5000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Chạy server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register/student` - Đăng ký sinh viên
- `POST /api/auth/register/lecturer` - Đăng ký giảng viên
- `POST /api/auth/email-verification` - Xác thực email với OTP
- `POST /api/auth/resend-otp` - Gửi lại OTP
- `POST /api/auth/logout` - Đăng xuất

### User

- `GET /api/user/trusted-devices` - Lấy danh sách thiết bị tin cậy
- `DELETE /api/user/trusted-devices/:device_id` - Xóa thiết bị tin cậy

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── controllers/       # Controllers xử lý logic
│   ├── routes/           # Định nghĩa API routes
│   ├── middleware/       # Middleware (auth, etc.)
│   ├── utils/            # Utilities (prisma, mail, session)
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Node.js** + **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **Jose** - JWT handling
- **Nodemailer** - Email sending
- **bcrypt** - Password hashing


