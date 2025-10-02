# Hướng Dẫn Migration từ CRA sang Next.js

## 🚀 Tổng Quan Migration

Dự án đã được chuyển đổi thành công từ **Create React App (CRA)** sang **Next.js 14** với App Router.

## 📋 Những Gì Đã Thay Đổi

### 1. Cấu Trúc Thư Mục

#### ❌ Cũ (CRA)
```
src/
├── App.jsx
├── index.js
├── index.css
└── components/
    ├── CloudBackground.jsx
    ├── RoleCard.jsx
    └── LoginForm.jsx
```

#### ✅ Mới (Next.js)
```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── globals.css        # Global styles
├── api/               # Backend API routes
│   ├── auth/
│   ├── courses/
│   ├── users/
│   ├── forum/
│   ├── assignments/
│   └── practice/
├── (auth)/            # Auth route group
│   ├── login/
│   └── register/
├── (dashboard)/       # Dashboard route group
│   ├── student/
│   ├── teacher/
│   └── admin/
├── courses/
├── forum/
└── practice/

components/            # Shared components
├── CloudBackground.tsx
├── RoleCard.tsx
└── LoginForm.tsx

lib/                   # Utility libraries
├── db/
├── auth/
├── validations/
└── utils/

types/                 # TypeScript definitions
hooks/                 # Custom React hooks
store/                 # State management
prisma/               # Database schema
└── migrations/
```

### 2. File Changes

| File Cũ | File Mới | Thay Đổi |
|---------|----------|-----------|
| `src/App.jsx` | `app/page.tsx` | Chuyển thành TypeScript, thêm 'use client' |
| `src/index.js` | `app/layout.tsx` | Root layout với metadata |
| `src/index.css` | `app/globals.css` | Giữ nguyên styles |
| `src/components/*.jsx` | `components/*.tsx` | Chuyển sang TypeScript |
| `package.json` | `package.json` | Cập nhật dependencies và scripts |

### 3. Dependencies Changes

#### ❌ Removed
- `react-scripts`
- `@testing-library/*`
- `web-vitals`

#### ✅ Added
- `next`
- `typescript`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `eslint-config-next`

### 4. Scripts Changes

#### ❌ Cũ
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

#### ✅ Mới
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

## 🛠️ Setup Development Environment

### 1. Cài Đặt Dependencies
```bash
# Xóa node_modules cũ
rm -rf node_modules package-lock.json

# Cài đặt dependencies mới
npm install
```

### 2. Environment Variables
```bash
# Copy environment example
cp env.example .env.local

# Cập nhật các giá trị trong .env.local
DATABASE_URL="postgresql://localhost:5432/smart_learning_dev"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Chạy Development Server
```bash
# Chạy Next.js development server
npm run dev

# Mở browser tại http://localhost:3000
```

## 🔧 Key Features Added

### 1. TypeScript Support
- Tất cả components đã được chuyển sang TypeScript
- Type safety cho props và state
- Better IDE support và autocomplete

### 2. App Router (Next.js 14)
- File-based routing
- Layout system
- Route groups `(auth)`, `(dashboard)`
- API routes trong `/app/api`

### 3. Server Components
- Better performance với server-side rendering
- Automatic code splitting
- Improved SEO

### 4. Path Aliases
```typescript
// tsconfig.json
"paths": {
  "@/*": ["./*"],
  "@/components/*": ["./components/*"],
  "@/lib/*": ["./lib/*"],
  "@/app/*": ["./app/*"]
}
```

### 5. API Routes Structure
```
app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   └── logout/route.ts
├── courses/
│   ├── route.ts
│   └── [id]/route.ts
└── users/
    ├── route.ts
    └── [id]/route.ts
```

## 📝 Development Workflow

### 1. Tạo Page Mới
```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  )
}
```

### 2. Tạo API Route
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello API' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

### 3. Tạo Component
```typescript
// components/NewComponent.tsx
'use client'

import React from 'react'

interface NewComponentProps {
  title: string
  children?: React.ReactNode
}

const NewComponent: React.FC<NewComponentProps> = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export default NewComponent
```

## 🚀 Deployment

### 1. Heroku Deployment
```bash
# Build project
npm run build

# Deploy to Heroku
git add .
git commit -m "Migrate to Next.js"
git push heroku main
```

### 2. Environment Variables (Heroku)
```bash
heroku config:set NEXTAUTH_SECRET="production-secret"
heroku config:set NEXTAUTH_URL="https://your-app.herokuapp.com"
heroku config:set DATABASE_URL="postgresql://..."
```

## 🔍 Troubleshooting

### 1. Lottie Animation Issues
```typescript
// Đảm bảo có 'use client' directive
'use client'

// Import trong component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': any
    }
  }
}
```

### 2. CSS Issues
```css
/* Đảm bảo Tailwind classes hoạt động */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Import Path Issues
```typescript
// Sử dụng path aliases
import CloudBackground from '@/components/CloudBackground'
import { prisma } from '@/lib/db'
```

## 📚 Next Steps

### 1. Thêm Database (Prisma)
```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. Thêm Authentication (NextAuth.js)
```bash
npm install next-auth
```

### 3. Thêm State Management (Zustand)
```bash
npm install zustand
```

### 4. Thêm Form Validation (Zod)
```bash
npm install zod @hookform/resolvers react-hook-form
```

## 🎯 Benefits Achieved

### ✅ Performance
- **Faster loading**: Server-side rendering
- **Better SEO**: Pre-rendered pages
- **Code splitting**: Automatic optimization

### ✅ Developer Experience
- **TypeScript**: Type safety
- **Hot reload**: Faster development
- **Better debugging**: Source maps

### ✅ Scalability
- **API routes**: Full-stack in one project
- **File-based routing**: Easy to organize
- **Middleware support**: Authentication, logging

### ✅ Production Ready
- **Heroku compatible**: Easy deployment
- **Environment variables**: Secure configuration
- **Error boundaries**: Better error handling

---

**🎉 Migration hoàn tất! Dự án đã sẵn sàng cho development và production.**
