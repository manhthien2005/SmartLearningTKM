import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/mail/sender"; // 📧 sử dụng hàm gửi mail của bạn

const prisma = new PrismaClient();

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email)
      return NextResponse.json({ message: "Missing email" }, { status: 400 });

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.status === "active")
      return NextResponse.json({ message: "Email already verified" }, { status: 400 });

    // 🔢 Tạo OTP mới
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

    // 📧 Gửi mail xác thực
    await sendEmail({
      to: email,
      subject: "Mã xác thực tài khoản mới của bạn",
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <h2>Xin chào ${user.full_name || "bạn"},</h2>
          <p>Bạn đã yêu cầu gửi lại mã OTP xác thực email.</p>
          <p>Mã OTP mới của bạn là:</p>
          <h3 style="font-size:22px;letter-spacing:3px">${otp}</h3>
          <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
          <hr />
          <p>Nếu bạn không yêu cầu gửi lại mã, vui lòng bỏ qua email này.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OTP resent successfully" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error in resend-otp API:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
