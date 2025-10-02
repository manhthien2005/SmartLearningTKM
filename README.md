# Smart Learning TKM

Hệ thống học tập thông minh được xây dựng với **Next.js 14**, **TypeScript**, và **Tailwind CSS**.

## 🚀 Tính Năng Chính

### 🎓 Quản Lý Tài Khoản
- **Đăng ký/Đăng nhập**: Giao diện hiện đại với animation
- **Phân quyền người dùng**: Sinh viên, Giảng viên, Quản trị viên
- **Quản lý thông tin cá nhân**: Cập nhật profile, avatar
- **Khôi phục mật khẩu**: Reset password qua email

### 💬 Diễn Đàn Trao Đổi
- **Tạo chủ đề**: Rich text editor với file upload
- **Bình luận phân cấp**: Nested comments system
- **Tương tác**: Like, share, bookmark
- **Tìm kiếm & lọc**: Advanced search với tags
- **Thông báo real-time**: WebSocket notifications

### 📚 Hệ Thống LMS
- **Quản lý khóa học**: Tạo, chỉnh sửa, xóa courses
- **Nội dung đa phương tiện**: Video, PDF, slides
- **Bài tập & kiểm tra**: Trắc nghiệm và tự luận
- **Chấm điểm tự động**: AI-powered grading
- **Thống kê tiến độ**: Analytics dashboard

### 🎯 Hệ Thống Luyện Tập
- **Ngân hàng câu hỏi**: Question bank management
- **Đề thi tự động**: AI-generated tests
- **Phân tích kết quả**: Performance analytics
- **Gợi ý cá nhân hóa**: Personalized recommendations

### 📅 Quản Lý Thời Gian
- **Lịch học**: Calendar integration
- **Kế hoạch cá nhân**: Personal study plans
- **To-do list**: Task management
- **Nhắc nhở thông minh**: Smart notifications

### 🤖 AI Features
- **Chatbot hỗ trợ**: 24/7 AI assistant
- **Tóm tắt nội dung**: Auto-summarization
- **Gợi ý tài liệu**: Content recommendations
- **Phân tích học tập**: Learning analytics

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework với App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Server-side API
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication
- **WebSocket** - Real-time features

### Deployment
- **Heroku** - Cloud platform
- **Vercel** - Alternative deployment
- **Docker** - Containerization support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-repo/smart-learning-tkm
cd smart-learning-tkm

# Install dependencies
npm install

# Setup environment variables
cp env.example .env.local
# Cập nhật các giá trị trong .env.local

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu Trúc Dự Án

```
smart-learning-tkm/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # Backend API routes
│   ├── 📁 (auth)/            # Authentication pages
│   ├── 📁 (dashboard)/       # Dashboard pages
│   ├── 📁 courses/           # Course pages
│   ├── 📁 forum/             # Forum pages
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── 📁 components/            # Reusable components
├── 📁 lib/                   # Utility libraries
├── 📁 types/                 # TypeScript definitions
├── 📁 hooks/                 # Custom React hooks
├── 📁 store/                 # State management
├── 📁 prisma/                # Database schema
├── 📁 Hướng dẫn/            # Documentation
└── 📁 public/                # Static assets
```

## 📚 Documentation

- [📖 Hướng dẫn cấu trúc dự án](./Hướng%20dẫn/HDSD.md)
- [🔄 Migration từ CRA sang Next.js](./Hướng%20dẫn/Migration-NextJS.md)
- [📋 JIRA & Sprint Planning](./Hướng%20dẫn/JIRA_SmartLearningTKM.md)
- [⚠️ Risk Management](./Hướng%20dẫn/RiskManagement.md)
- [📊 Task Allocation](./Hướng%20dẫn/TaskAllocation.md)

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

## 🌐 Deployment

### Heroku Deployment
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create smart-learning-tkm

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NEXTAUTH_SECRET="your-production-secret"
heroku config:set NEXTAUTH_URL="https://your-app.herokuapp.com"

# Deploy
git push heroku main

# Run database migrations
heroku run npx prisma migrate deploy
```

## 👥 Team

- **Frontend Team**: UI/UX components, responsive design
- **Backend Team**: API development, database design
- **DevOps Team**: Deployment, monitoring, CI/CD

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- 📧 Email: support@smartlearning-tkm.com
- 💬 Discord: [Smart Learning Community](https://discord.gg/smartlearning)
- 📖 Wiki: [Project Documentation](https://github.com/your-repo/smart-learning-tkm/wiki)

---

**Made with ❤️ by Team TKM - 2025**
