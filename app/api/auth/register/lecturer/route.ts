import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { registerBaseUser, assignRole } from "@/lib/auth/register";
import { validateRegisterInput } from "@/lib/validation/register-validation";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, email, password, confirmPassword } = body;

    // ✅ Kiểm tra tính hợp lệ
    const validationError = validateRegisterInput({ full_name, email, password, confirmPassword });
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    // 🧱 Tạo user cơ bản + OTP
    const user = await registerBaseUser(email, password, full_name);

    // 👨‍🏫 Gán role "teacher"
    await assignRole(user.user_id, "Lecturer");

    // 🧾 Tạo bản ghi Teachers
    await prisma.teachers.create({
      data: { user_id: user.user_id },
    });

    return NextResponse.json({
      message: "Đăng ký giảng viên thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Teacher Register Error:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ" },
      { status: 500 }
    );
  }
}
