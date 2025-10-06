import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/mail/sender"; // 👈 thêm dòng này

const prisma = new PrismaClient();

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export async function POST(req: Request) {
  try {
    const { email, password, full_name} = await req.json();

    // Kiểm tra trùng email
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { email, password_hash, full_name, status: "pending" },
    });

    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    await prisma.user_OTPs.create({
      data: {
        user_id: user.user_id,
        code: otp,
        purpose: "verify_email",
        expires_at,
      },
    });

    await sendEmail({
      to: email,
      subject: "Xác thực tài khoản của bạn",
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <h2>Xin chào ${full_name},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
          <p>Mã OTP của bạn là:</p>
          <h3 style="font-size:22px;letter-spacing:3px">${otp}</h3>
          <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
          <hr />
          <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "User created successfully. Please verify your email via OTP.",
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error in register API:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message || error.toString() },
      { status: 500 }
    );
  }
}