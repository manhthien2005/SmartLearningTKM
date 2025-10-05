import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/mail/sender";

const prisma = new PrismaClient();

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Email không tồn tại" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ message: "Sai mật khẩu" }, { status: 401 });
    }

    // Tạo OTP và lưu vào DB
    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    await prisma.user_OTPs.create({
      data: {
        user_id: user.user_id,
        code: otp,
        purpose: "login",
        expires_at,
      },
    });

    // Gửi OTP về email
    await sendEmail({
      to: email,
      subject: "Mã OTP đăng nhập SmartLearning",
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <h2>Xin chào ${user.full_name},</h2>
          <p>Mã OTP đăng nhập của bạn là:</p>
          <h3 style="font-size:22px;letter-spacing:3px">${otp}</h3>
          <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Đã gửi OTP về email. Vui lòng nhập OTP để xác thực đăng nhập.",
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}