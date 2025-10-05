import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, otp, token } = await req.json();

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

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
        return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });

      if (record.expires_at < new Date()) {
        return NextResponse.json({ message: "OTP expired" }, { status: 400 });
      }

      await prisma.users.update({
        where: { user_id: user.user_id },
        data: { email_verified: true, status: "active" },
      });

      await prisma.user_OTPs.update({
        where: { otp_id: record.otp_id },
        data: { used: true },
      });

      return NextResponse.json({ message: "Email verified via OTP" });
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
        return NextResponse.json({ message: "Invalid token" }, { status: 400 });

      if (record.expires_at < new Date()) {
        return NextResponse.json({ message: "Token expired" }, { status: 400 });
      }

      await prisma.users.update({
        where: { user_id: user.user_id },
        data: { email_verified: true, status: "active" },
      });

      await prisma.email_Verifications.update({
        where: { verification_id: record.verification_id },
        data: { verified: true },
      });

      return NextResponse.json({ message: "Email verified via Token" });
    }

    // ❌ Nếu thiếu cả hai
    return NextResponse.json({ message: "Missing OTP or token" }, { status: 400 });
  } catch (error: any) {
    console.error("❌ Error in email verification:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
