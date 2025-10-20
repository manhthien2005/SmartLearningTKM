# 📋 Hướng dẫn Migration: Next.js Monolith → FE + BE riêng biệt

## ✅ Đã hoàn thành

### 1. Tách Backend (Node.js + Express)
- ✅ Setup Express server
- ✅ Convert Next.js API routes → Express routes
- ✅ Di chuyển Prisma schema + migrations
- ✅ Setup JWT authentication
- ✅ Email service (Nodemailer)
- ✅ CORS configuration

### 2. Tách Frontend (Next.js 14)
- ✅ Giữ nguyên toàn bộ code FE hiện có
- ✅ Setup Redux Toolkit với authSlice
- ✅ Setup React Query với useAuth hook
- ✅ Setup i18n (vi/en)
- ✅ API client với Axios
- ✅ Middleware authentication

### 3. Kết nối FE-BE
- ✅ CORS đã cấu hình
- ✅ Cookies-based authentication
- ✅ API proxy qua Next.js rewrites

## 🚀 Cách chạy dự án

### Option 1: Chạy cả hai cùng lúc (Recommended)

```bash
# Từ root folder
npm install
npm run dev
```

Hoặc:

```bash
.\setup.ps1
npm run dev
```

### Option 2: Chạy riêng lẻ

Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

## 📝 Checklist Setup lần đầu

### Backend

1. [ ] Install dependencies
   ```bash
   cd backend
   npm install
   ```

2. [ ] Tạo file `.env` từ `.env.example`
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/smartlearning
   JWT_SECRET=your-secret-key
   PORT=5000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

3. [ ] Generate Prisma Client
   ```bash
   npm run prisma:generate
   ```

4. [ ] Run database migrations
   ```bash
   npm run prisma:migrate
   ```

5. [ ] Start backend
   ```bash
   npm run dev
   ```

### Frontend

1. [ ] Install dependencies
   ```bash
   cd frontend
   npm install
   ```

2. [ ] Tạo file `.env.local`
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. [ ] Start frontend
   ```bash
   npm run dev
   ```

## 🎯 Sử dụng Redux & React Query

### 1. Redux Store (authSlice)

Quản lý auth state globally:

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCredentials, logout } from '@/store/slices/authSlice';

function MyComponent() {
  const { isLogin, user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  // Lưu user sau khi login
  dispatch(setCredentials({ 
    user: { user_id: 1, email: 'user@example.com', full_name: 'User', role: 'Student' },
    token: 'jwt-token'
  }));
  
  // Logout
  dispatch(logout());
}
```

### 2. React Query (useAuth hook)

Xử lý API calls với loading/error states:

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { 
    login, 
    isLoggingIn, 
    isLogin, 
    user 
  } = useAuth();
  
  const handleLogin = () => {
    login({
      email: 'student@example.com',
      password: 'Password@123',
      selectedRole: 'student',
      rememberDevice: true,
      deviceToken: localStorage.getItem('deviceToken')
    });
  };
  
  return (
    <button onClick={handleLogin} disabled={isLoggingIn}>
      {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
    </button>
  );
}
```

### 3. i18n

Đa ngôn ngữ vi/en:

```typescript
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation('vi'); // hoặc 'en'
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('login')}</button>
    </div>
  );
}
```

## 🔧 Sửa các components cũ

### Trước (gọi API trực tiếp):

```typescript
// ❌ Old way
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### Sau (dùng useAuth hook):

```typescript
// ✅ New way
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  
  const handleLogin = () => {
    login({ email, password, selectedRole: 'student' });
  };
}
```

## 📡 API Endpoints

### Backend API (http://localhost:5000)

Authentication:
- `POST /api/auth/login`
- `POST /api/auth/register/student`
- `POST /api/auth/register/lecturer`
- `POST /api/auth/email-verification`
- `POST /api/auth/resend-otp`
- `POST /api/auth/logout`

User:
- `GET /api/user/trusted-devices`
- `DELETE /api/user/trusted-devices/:device_id`

### Frontend (http://localhost:3000)

Pages:
- `/` - Home
- `/login` - Login page
- `/student/*` - Student dashboard
- `/teacher/*` - Teacher dashboard
- `/admin` - Admin page

## 🐛 Common Issues

### 1. CORS Error
**Vấn đề:** Frontend không connect được backend

**Giải pháp:**
- Kiểm tra `FRONTEND_URL` trong backend `.env`
- Đảm bảo backend đang chạy trên port 5000
- Kiểm tra `NEXT_PUBLIC_API_URL` trong frontend `.env.local`

### 2. Session không persist
**Vấn đề:** Đăng nhập xong bị logout

**Giải pháp:**
- Kiểm tra cookies được set đúng (HttpOnly, SameSite)
- Xem Console → Application → Cookies
- Đảm bảo `withCredentials: true` trong axios client

### 3. Database connection failed
**Vấn đề:** Backend không kết nối database

**Giải pháp:**
- Kiểm tra `DATABASE_URL` trong backend `.env`
- Đảm bảo PostgreSQL đang chạy
- Chạy lại migrations: `npm run prisma:migrate`

### 4. Module not found
**Vấn đề:** Import errors

**Giải pháp:**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## 📚 Tài liệu tham khảo

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Cấu trúc dự án: `PROJECT_STRUCTURE.md`

## 💡 Tips

1. **Development**: Luôn chạy cả FE và BE cùng lúc
2. **Redux DevTools**: Install extension để debug Redux state
3. **React Query DevTools**: Tích hợp sẵn, check console
4. **Hot Reload**: Cả FE và BE đều support hot reload
5. **Logs**: Check terminal logs để debug issues

## ✨ Next Steps

1. [ ] Test toàn bộ flow: Register → Verify → Login
2. [ ] Kiểm tra các protected routes
3. [ ] Test OTP email
4. [ ] Test remember device
5. [ ] Update các components cũ sang dùng useAuth hook
6. [ ] Add more API endpoints nếu cần
7. [ ] Deploy lên production

Chúc Mr. Thiên code vui vẻ! 🚀


