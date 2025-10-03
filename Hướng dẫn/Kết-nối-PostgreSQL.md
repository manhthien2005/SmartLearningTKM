1. Cài đặt Prisma và PostgreSQL client
   npm install @prisma/client
   npm install -D prisma

2. Khởi tạo Prisma
   npx prisma init

Lệnh này tạo ra thư mục:
prisma/
schema.prisma
.env

3. Cấu hình .env
   DATABASE_URL="postgresql://username:password@localhost:5432/yourdbname?schema=public"
   Ví dụ: DATABASE_URL="postgresql://postgres:123456@localhost:5432/SmartLearning?schema=public"

4. Định nghĩa schema Prisma
   File: prisma/schema.prisma

- Định nghĩa theo bảng muốn dùng
- Ví dụ với các bảng Acount:
  generator client {
  provider = "prisma-client-js"
  }

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model Users {
user_id Int @id @default(autoincrement())
email String @unique
password_hash String
full_name String
phone_number String?
avatar_url String?
date_of_birth DateTime?
gender String?
address String?
status String @default("active")
email_verified Boolean @default(false)
created_at DateTime @default(now())
updated_at DateTime @updatedAt
last_login DateTime?

user_roles User_Roles[]
password_reset_tokens Password_Reset_Tokens[]
email_verifications Email_Verifications[]
}

model Roles {
role_id Int @id @default(autoincrement())
role_name String @unique
description String?
created_at DateTime @default(now())

user_roles User_Roles[]
}

model User_Roles {
user_role_id Int @id @default(autoincrement())
user_id Int
role_id Int
assigned_at DateTime @default(now())

user Users @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
role Roles @relation(fields: [role_id], references: [role_id], onDelete: Cascade)

@@unique([user_id, role_id])
}

model Password_Reset_Tokens {
token_id Int @id @default(autoincrement())
user_id Int
token String @unique
expires_at DateTime
used Boolean @default(false)
created_at DateTime @default(now())

user Users @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
}

model Email_Verifications {
verification_id Int @id @default(autoincrement())
user_id Int
token String @unique
expires_at DateTime
verified Boolean @default(false)
created_at DateTime @default(now())

user Users @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
}

5. Tạo migration
   npx prisma migrate dev --name init
   Lệnh này sẽ:

- Tạo bảng trong PostgreSQL dựa trên schema đã tạo ở bước 4
- Sinh ra Prisma Client để query DB

Trong quá trình tạo sai có thể dùng lệnh sau để reset lại:
npx prisma migrate reset

6. Tạo file Prisma client
   Tạo file lib/prisma.ts (lib nằm trong dự án gốc SMARTLEARNINGTKM/lib) để kết nối (tránh duplicate khi chạy Next.js hot reload):

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
globalForPrisma.prisma ||
new PrismaClient({
log: ["query"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

7. Test kết nối
   Ví dụ tạo API route để test DB:
   File: app/api/test/route.ts
   Code:
   import { NextResponse } from "next/server";
   import { prisma } from "@/lib/prisma";

export async function GET() {
const users = await prisma.users.findMany();
return NextResponse.json(users);
}

Chạy server:
npm run dev
Mở: http://localhost:3000/api/test
