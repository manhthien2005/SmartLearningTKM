# SmartLearning Frontend

Frontend cho SmartLearning platform sử dụng Next.js 14, Redux Toolkit, React Query, và i18n.

## Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### 4. Build production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** - React framework với App Router
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **i18n** - Internationalization (vi/en)

## Cấu trúc thư mục

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, admin)
│   ├── (dashboard)/         # Dashboard pages (student, teacher)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── auth/               # Auth components
│   ├── forum/              # Forum components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── hooks/                   # Custom hooks
│   ├── useAuth.ts          # Auth hook with React Query
│   └── useTranslation.ts   # i18n hook
├── store/                   # Redux store
│   ├── slices/             # Redux slices
│   │   └── authSlice.ts    # Auth state (isLogin, user, token)
│   ├── hooks.ts            # Redux hooks
│   └── index.ts            # Store config
├── lib/                     # Utilities
│   ├── api/                # API clients
│   │   ├── client.ts       # Axios client
│   │   └── auth.ts         # Auth API
│   └── providers/          # Context providers
│       ├── ReduxProvider.tsx
│       └── ReactQueryProvider.tsx
├── i18n/                    # Internationalization
│   ├── locales/
│   │   ├── vi/
│   │   │   └── common.json
│   │   └── en/
│   │       └── common.json
│   └── config.ts
├── middleware.ts            # Next.js middleware
└── next.config.js

## Features

### Redux Store

State management với Redux Toolkit:

- **authSlice**: Quản lý authentication state
  - `isLogin`: Trạng thái đăng nhập
  - `user`: Thông tin user
  - `token`: JWT token (optional)

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCredentials, logout } from '@/store/slices/authSlice';

const { isLogin, user } = useAppSelector((state) => state.auth);
```

### React Query

Server state management với useAuth hook:

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login, isLoggingIn, isLogin, user } = useAuth();
  
  const handleLogin = () => {
    login({
      email: 'user@example.com',
      password: 'password',
      selectedRole: 'student'
    });
  };
}
```

### i18n

Đa ngôn ngữ (vi/en):

```typescript
import { useTranslation } from '@/hooks/useTranslation';

function Component() {
  const { t } = useTranslation('vi');
  
  return <h1>{t('welcome')}</h1>;
}
```

## API Integration

Frontend kết nối với Backend API qua:

- **Axios client** (`lib/api/client.ts`)
- **API functions** (`lib/api/auth.ts`)
- **withCredentials**: true (để gửi cookies)
- **CORS**: Đã cấu hình với Backend

## Routes

### Public Routes
- `/` - Home page
- `/login` - Login page

### Protected Routes
- `/student/*` - Student dashboard
- `/teacher/*` - Teacher dashboard
- `/admin` - Admin page

Middleware sẽ tự động redirect nếu chưa đăng nhập.










