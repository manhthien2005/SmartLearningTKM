import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSession } from "@/lib/auth/session";
import { parseDeviceInfo } from "@/lib/auth/device";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, otp, token, rememberDevice, deviceToken } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email không được để trống" }, { status: 400 });
    }

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

      // 🔐 Lưu thiết bị tin cậy nếu user chọn "Ghi nhớ đăng nhập"
      if (rememberDevice && deviceToken && record.purpose === "login") {
        const userAgent = req.headers.get('user-agent') || 'Unknown';
        const deviceInfo = parseDeviceInfo(userAgent);

        // Kiểm tra thiết bị đã tồn tại chưa
        const existingDevice = await prisma.trusted_Devices.findFirst({
          where: {
            user_id: user.user_id,
            device_token: deviceToken,
          },
        });

        if (existingDevice) {
          // Cập nhật thời gian hết hạn (30 ngày từ bây giờ)
          await prisma.trusted_Devices.update({
            where: { device_id: existingDevice.device_id },
            data: {
              last_used: new Date(),
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
            },
          });
        } else {
          // Tạo mới thiết bị tin cậy
          await prisma.trusted_Devices.create({
            data: {
              user_id: user.user_id,
              device_token: deviceToken,
              device_name: deviceInfo.device_name,
              device_type: deviceInfo.device_type,
              user_agent: userAgent,
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
            },
          });
        }
      }

      // Get user role for session
      const userRole = await prisma.user_Roles.findFirst({
        where: { user_id: user.user_id },
        include: { role: true }
      });

      // Create session
      await createSession({
        user_id: user.user_id.toString(),
        email: user.email,
        role: userRole?.role.role_name || 'Student',
        full_name: user.full_name,
      });

      return NextResponse.json({ 
        message: "Email xác thực thành công",
        user: {
          id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: userRole?.role.role_name || 'Student'
        }
      });
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

      // Get user role for session
      const userRole = await prisma.user_Roles.findFirst({
        where: { user_id: user.user_id },
        include: { role: true }
      });

      // Create session
      await createSession({
        user_id: user.user_id.toString(),
        email: user.email,
        role: userRole?.role.role_name || 'Student',
        full_name: user.full_name,
      });

      return NextResponse.json({ 
        message: "Email đã xác thực",
        user: {
          id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: userRole?.role.role_name || 'Student'
        }
      });
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
