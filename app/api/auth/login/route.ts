import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/mail/sender";
import { createSession } from "@/lib/auth/session";

const prisma = new PrismaClient();

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export async function POST(req: Request) {
  try {
    const { email, password, rememberDevice, deviceToken, selectedRole } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Vui lòng nhập đầy đủ thông tin" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không chính xác" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không chính xác" }, { status: 401 });
    }

    // 🔐 Kiểm tra role của user trong database
    if (selectedRole) {
      // Lấy role của user từ DB
      const userRole = await prisma.user_Roles.findFirst({
        where: { user_id: user.user_id },
        include: { role: true },
      });

      if (!userRole) {
        return NextResponse.json({ message: "Tài khoản chưa được gán quyền" }, { status: 403 });
      }

      const dbRoleName = userRole.role.role_name.toLowerCase();
      const requestedRole = selectedRole.toLowerCase();

      // Map role names
      const roleMapping: Record<string, string[]> = {
        'student': ['student'],
        'teacher': ['lecturer', 'teacher'],
      };

      // Kiểm tra role có khớp không
      const allowedRoles = roleMapping[requestedRole] || [];
      if (!allowedRoles.includes(dbRoleName)) {
        // Role không khớp - báo lỗi rõ ràng
        if (requestedRole === 'student' && (dbRoleName === 'lecturer' || dbRoleName === 'teacher')) {
          return NextResponse.json({ 
            message: "Tài khoản này không thuộc loại sinh viên. Vui lòng đăng nhập bằng trang dành cho giảng viên.",
            wrongRole: true,
            correctRole: 'teacher'
          }, { status: 403 });
        } else if ((requestedRole === 'teacher' || requestedRole === 'lecturer') && dbRoleName === 'student') {
          return NextResponse.json({ 
            message: "Tài khoản này không thuộc loại giảng viên. Vui lòng đăng nhập bằng trang dành cho sinh viên.",
            wrongRole: true,
            correctRole: 'student'
          }, { status: 403 });
        } else {
          return NextResponse.json({ 
            message: `Tài khoản không có quyền đăng nhập với vai trò ${requestedRole}`,
            wrongRole: true
          }, { status: 403 });
        }
      }
    }

    // Check if account is active
    if (user.status === 'pending') {
      return NextResponse.json({ 
        message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email hoặc yêu cầu gửi lại mã OTP",
        action: "resend_otp" // Frontend có thể dùng để hiển thị nút "Gửi lại OTP"
      }, { status: 403 });
    }

    if (user.status === 'inactive') {
      return NextResponse.json({ message: "Tài khoản đã bị vô hiệu hóa" }, { status: 403 });
    }

    // 🔐 Kiểm tra thiết bị đã tin cậy chưa (nếu có deviceToken)
    if (deviceToken) {
      const trustedDevice = await prisma.trusted_Devices.findFirst({
        where: {
          user_id: user.user_id,
          device_token: deviceToken,
          expires_at: {
            gte: new Date(), // Chưa hết hạn
          },
        },
      });

      if (trustedDevice) {
        // Cập nhật thời gian sử dụng cuối
        await prisma.trusted_Devices.update({
          where: { device_id: trustedDevice.device_id },
          data: { last_used: new Date() },
        });

        // Lấy role của user để tạo session
        const userRole = await prisma.user_Roles.findFirst({
          where: { user_id: user.user_id },
          include: { role: true },
        });

        // Tạo session cho user
        await createSession({
          user_id: user.user_id.toString(),
          email: user.email,
          role: userRole?.role.role_name || 'Student',
          full_name: user.full_name,
        });

        // ✅ Thiết bị tin cậy - Bỏ qua OTP, đăng nhập thành công luôn
        return NextResponse.json({
          message: "Đăng nhập thành công",
          skipOTP: true,
          user: {
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
            role: userRole?.role.role_name || 'Student',
          },
        });
      }
    }

    // ❌ Thiết bị chưa tin cậy - Gửi OTP
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
      skipOTP: false,
      deviceToken: deviceToken, // Sử dụng deviceToken từ client (localStorage)
      rememberDevice: rememberDevice || false,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Login Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}