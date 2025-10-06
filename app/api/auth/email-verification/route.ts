import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, otp, token } = await req.json();

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });

    // ✅ 1️⃣ Xác thực bằng OTP
    if (otp) {
      const record = await prisma.user_OTPs.findFirst({
        where: {
          user_id: user.user_id,
          code: otp,
          purpose: { in: ["verify_email", "login"] },
          used: false,
        },
      });

      if (!record)
        return NextResponse.json({ message: "OTP không hợp lệ" }, { status: 400 });

      if (record.expires_at < new Date()) {
        return NextResponse.json({ message: "OTP đã hết hạn" }, { status: 400 });
      }

      await prisma.users.update({
        where: { user_id: user.user_id },
        data: { email_verified: true, status: "active" },
      });

      await prisma.user_OTPs.update({
        where: { otp_id: record.otp_id },
        data: { used: true },
      });

      return NextResponse.json({ message: "Email xác thực thành công" });
    }

    // ✅ 2️⃣ Xác thực bằng Token
    if (token) {
      const record = await prisma.email_Verifications.findFirst({
        where: {
          user_id: user.user_id,
          token,
          verified: false,
        },
      });

      if (!record)
        return NextResponse.json({ message: "Token không hợp lệ" }, { status: 400 });

      if (record.expires_at < new Date()) {
        return NextResponse.json({ message: "Token đã hết hạn" }, { status: 400 });
      }

      await prisma.users.update({
        where: { user_id: user.user_id },
        data: { email_verified: true, status: "active" },
      });

      await prisma.email_Verifications.update({
        where: { verification_id: record.verification_id },
        data: { verified: true },
      });

      return NextResponse.json({ message: "Email đã xác thực" });
    }

    // ❌ Nếu thiếu cả hai
    return NextResponse.json({ message: "Thiếu OTP hoặc token" }, { status: 400 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error in email verification:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống", error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
