# 📝 Cập nhật Role: Lecturer → Instructor

## Thay đổi trong Database

### Bảng `Roles`
```sql
-- Old: role_name = 'Lecturer'
-- New: role_name = 'Instructor'
UPDATE "Roles" SET "role_name" = 'Instructor', "description" = 'Giảng Viên'
WHERE "role_name" = 'Lecturer';
```

### Bảng `Teachers` → `Instructors`
- Đã đổi tên bảng từ `Teachers` sang `Instructors`
- Đổi `teacher_id` → `instructor_id`
- Đổi FK `teacher_id` trong `Teaching_Experiences` → `instructor_id`

---

## Thay đổi trong Backend

### 1. Prisma Schema (`schema.prisma`)
```prisma
// Old
model Teachers {
  teacher_id Int @id
  user_id Int @unique
  teaching_experiences Teaching_Experiences[]
}

// New
model Instructors {
  instructor_id Int @id
  user_id Int @unique
  teaching_experiences Teaching_Experiences[]
  
  @@map("Instructors")
}
```

### 2. Controllers (`auth.controller.ts`)
- ✅ `registerLecturer()` → `registerInstructor()`
- ✅ `prisma.teachers.create()` → `prisma.instructors.create()`
- ✅ Role lookup: `'Lecturer'` → `'Instructor'`
- ✅ roleMapping: `teacher: ['lecturer', 'teacher']` → `instructor: ['instructor']`

### 3. Routes (`auth.routes.ts`)
- ✅ `/api/auth/register/lecturer` → `/api/auth/register/instructor`
- ✅ `authController.registerLecturer` → `authController.registerInstructor`

### 4. Swagger (`swagger.ts`)
- ✅ Enum: `['STUDENT', 'LECTURER', 'ADMIN']` → `['STUDENT', 'INSTRUCTOR', 'ADMIN']`

### 5. Services (`auth.service.ts`)
- ✅ roleMapping cập nhật thành `instructor: ['instructor']`

---

## Thay đổi trong Frontend

### Folder Structure
```
Old: frontend/app/(dashboard)/teacher/
New: frontend/app/(dashboard)/instructor/
```

- ✅ `teacher/page.tsx` → `instructor/page.tsx`
- ✅ `teacher/layout.tsx` → `instructor/layout.tsx`
- ✅ Tất cả sub-routes: courses, students, assignments, etc.

---

## Migration

File: `20251018_update_role_instructor/migration.sql`

```sql
UPDATE "Roles" SET "role_name" = 'Instructor', "description" = 'Giảng Viên'
WHERE "role_name" = 'Lecturer';
```

**Status:** ✅ Đã apply thành công

---

## API Endpoints

### Đăng ký
```bash
# Student
POST /api/auth/register/student

# Instructor (không còn /register/lecturer)
POST /api/auth/register/instructor
```

### Login
```json
{
  "email": "user@example.com",
  "password": "password",
  "selectedRole": "instructor"  // Không còn "teacher" hay "lecturer"
}
```

---

## Roles trong hệ thống

| Role ID | Role Name   | Description  |
|---------|-------------|--------------|
| 1       | Student     | Sinh Viên    |
| 2       | Instructor  | Giảng Viên   |
| 3       | Admin       | Quản Trị Viên|

---

## Testing

```bash
# Restart backend để apply changes
docker compose restart backend

# Test đăng ký instructor
curl -X POST http://localhost:5000/api/auth/register/instructor \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Nguyễn Văn A",
    "email": "instructor@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

---

## Checklist

- [x] Database: Đổi role `Lecturer` → `Instructor`
- [x] Database: Đổi bảng `Teachers` → `Instructors`
- [x] Prisma: Cập nhật schema
- [x] Prisma: Generate client mới
- [x] Backend: Đổi function names
- [x] Backend: Cập nhật routes
- [x] Backend: Cập nhật swagger
- [x] Frontend: Rename folder `teacher` → `instructor`
- [x] Migration: Tạo và apply migration

✅ **Hoàn tất!**
