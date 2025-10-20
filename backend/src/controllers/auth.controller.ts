import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { sendEmail, generateOTP } from '../utils/mail';
import { createSession, deleteSession } from '../utils/session';
import { validateRegisterInput } from '../utils/validation';

// ===== LOGIN =====
export async function login(req: Request, res: Response) {
  try {
    const { email, password, rememberDevice, deviceToken, selectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // Kiểm tra role
    if (selectedRole) {
      const userRole = await prisma.user_Roles.findFirst({
        where: { user_id: user.user_id },
        include: { role: true },
      });

      if (!userRole) {
        return res.status(403).json({ message: 'Tài khoản chưa được gán quyền' });
      }

      const dbRoleName = userRole.role.role_name.toLowerCase();
      const requestedRole = selectedRole.toLowerCase();

      const roleMapping: Record<string, string[]> = {
        student: ['student'],
        instructor: ['instructor'],
      };

      const allowedRoles = roleMapping[requestedRole] || [];
      if (!allowedRoles.includes(dbRoleName)) {
        if (requestedRole === 'student' && dbRoleName === 'instructor') {
          return res.status(403).json({
            message: 'Tài khoản này không thuộc loại sinh viên. Vui lòng đăng nhập bằng trang dành cho giảng viên.',
            wrongRole: true,
            correctRole: 'instructor',
          });
        } else if (requestedRole === 'instructor' && dbRoleName === 'student') {
          return res.status(403).json({
            message: 'Tài khoản này không thuộc loại giảng viên. Vui lòng đăng nhập bằng trang dành cho sinh viên.',
            wrongRole: true,
            correctRole: 'student',
          });
        } else {
          return res.status(403).json({
            message: `Tài khoản không có quyền đăng nhập với vai trò ${requestedRole}`,
            wrongRole: true,
          });
        }
      }
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email hoặc yêu cầu gửi lại mã OTP',
        action: 'resend_otp',
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Tài khoản đã bị vô hiệu hóa' });
    }

    // Kiểm tra thiết bị tin cậy
    if (deviceToken) {
      const trustedDevice = await prisma.trusted_Devices.findFirst({
        where: {
          user_id: user.user_id,
          device_token: deviceToken,
          expires_at: { gte: new Date() },
        },
      });

      if (trustedDevice) {
        await prisma.trusted_Devices.update({
          where: { device_id: trustedDevice.device_id },
          data: { last_used: new Date() },
        });

        const userRole = await prisma.user_Roles.findFirst({
          where: { user_id: user.user_id },
          include: { role: true },
        });

        await createSession(res, {
          user_id: user.user_id.toString(),
          email: user.email,
          role: userRole?.role.role_name || 'Student',
          full_name: user.full_name,
        });

        return res.json({
          message: 'Đăng nhập thành công',
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

    // Gửi OTP
    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user_OTPs.create({
      data: {
        user_id: user.user_id,
        code: otp,
        purpose: 'login',
        expires_at,
      },
    });

    await sendEmail({
      to: email,
      subject: 'Mã OTP đăng nhập SmartLearning',
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <h2>Xin chào ${user.full_name},</h2>
          <p>Mã OTP đăng nhập của bạn là:</p>
          <h3 style="font-size:22px;letter-spacing:3px">${otp}</h3>
          <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
        </div>
      `,
    });

    return res.json({
      message: 'Đã gửi OTP về email. Vui lòng nhập OTP để xác thực đăng nhập.',
      skipOTP: false,
      deviceToken: deviceToken,
      rememberDevice: rememberDevice || false,
    });
  } catch (error: any) {
    console.error('❌ Login Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ===== REGISTER STUDENT =====
export async function registerStudent(req: Request, res: Response) {
  try {
    const { full_name, email, password, confirmPassword } = req.body;

    const validationError = validateRegisterInput({ full_name, email, password, confirmPassword });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existing = await prisma.users.findUnique({ where: { email } });

    if (existing) {
      if (existing.status === 'pending' && !existing.email_verified) {
        await prisma.users.delete({ where: { user_id: existing.user_id } });
      } else {
        return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password_hash,
        full_name,
        status: 'pending',
      },
    });

    const role = await prisma.roles.findUnique({ where: { role_name: 'Student' } });
    if (!role) {
      throw new Error('Role "Student" not found');
    }

    await prisma.user_Roles.create({
      data: {
        user_id: user.user_id,
        role_id: role.role_id,
      },
    });

    await prisma.students.create({
      data: { user_id: user.user_id },
    });

    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user_OTPs.create({
      data: {
        user_id: user.user_id,
        code: otp,
        purpose: 'verify_email',
        expires_at,
      },
    });

    await sendEmail({
      to: email,
      subject: 'Xác thực tài khoản của bạn',
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <h2>Xin chào ${full_name},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
          <p>Mã OTP của bạn là:</p>
          <h3 style="font-size:22px;letter-spacing:3px">${otp}</h3>
          <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
        </div>
      `,
    });

    return res.json({
      message: 'Đăng ký sinh viên thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
    });
  } catch (error: any) {
    console.error('❌ Student Register Error:', error);
    return res.status(500).json({ message: error.message || 'Lỗi máy chủ' });
  }
}

// ===== REGISTER INSTRUCTOR =====
export async function registerInstructor(req: Request, res: Response) {
  try {
    const { full_name, email, password, confirmPassword } = req.body;

    const validationError = validateRegisterInput({ full_name, email, password, confirmPassword });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existing = await prisma.users.findUnique({ where: { email } });

    if (existing) {
      if (existing.status === 'pending' && !existing.email_verified) {
        await prisma.users.delete({ where: { user_id: existing.user_id } });
      } else {
        return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password_hash,
        full_name,
        status: 'pending',
      },
    });

    const role = await prisma.roles.findUnique({ where: { role_name: 'Instructor' } });
    if (!role) {
      throw new Error('Role "Instructor" not found');
    }

    await prisma.user_Roles.create({
      data: {
        user_id: user.user_id,
        role_id: role.role_id,
      },
    });

    await prisma.instructors.create({
      data: { user_id: user.user_id },
    });

    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user_OTPs.create({
      data: {
        user_id: user.user_id,
        code: otp,
        purpose: 'verify_email',
        expires_at,
      },
    });

    await sendEmail({
      to: email,
      subject: 'Xác thực tài khoản của bạn',
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <h2>Xin chào ${full_name},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản giảng viên.</p>
          <p>Mã OTP của bạn là:</p>
          <h3 style="font-size:22px;letter-spacing:3px">${otp}</h3>
          <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
        </div>
      `,
    });

    return res.json({
      message: 'Đăng ký giảng viên thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
    });
  } catch (error: any) {
    console.error('❌ Instructor Register Error:', error);
    return res.status(500).json({ message: error.message || 'Lỗi máy chủ' });
  }
}

// ===== VERIFY EMAIL =====
export async function verifyEmail(req: Request, res: Response) {
  try {
    const { email, otp, deviceToken, rememberDevice } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email và OTP là bắt buộc' });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const otpRecord = await prisma.user_OTPs.findFirst({
      where: {
        user_id: user.user_id,
        code: otp,
        purpose: { in: ['verify_email', 'login'] },
        used: false,
        expires_at: { gte: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
    }

    await prisma.user_OTPs.update({
      where: { otp_id: otpRecord.otp_id },
      data: { used: true },
    });

    if (otpRecord.purpose === 'verify_email') {
      await prisma.users.update({
        where: { user_id: user.user_id },
        data: {
          email_verified: true,
          status: 'active',
        },
      });
    }

    // Tạo trusted device nếu cần
    if (rememberDevice && deviceToken) {
      const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await prisma.trusted_Devices.create({
        data: {
          user_id: user.user_id,
          device_token: deviceToken,
          device_name: req.headers['user-agent'] || 'Unknown',
          expires_at,
        },
      });
    }

    const userRole = await prisma.user_Roles.findFirst({
      where: { user_id: user.user_id },
      include: { role: true },
    });

    await createSession(res, {
      user_id: user.user_id.toString(),
      email: user.email,
      role: userRole?.role.role_name || 'Student',
      full_name: user.full_name,
    });

    return res.json({
      message: 'Xác thực thành công',
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: userRole?.role.role_name || 'Student',
      },
    });
  } catch (error: any) {
    console.error('❌ Verify Email Error:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}

// ===== RESEND OTP =====
export async function resendOTP(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc' });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user_OTPs.create({
      data: {
        user_id: user.user_id,
        code: otp,
        purpose: user.email_verified ? 'login' : 'verify_email',
        expires_at,
      },
    });

    await sendEmail({
      to: email,
      subject: 'Mã OTP mới của bạn',
      html: `
        <div style="font-family:sans-serif;line-height:1.5">
          <h2>Xin chào ${user.full_name},</h2>
          <p>Mã OTP mới của bạn là:</p>
          <h3 style="font-size:22px;letter-spacing:3px">${otp}</h3>
          <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
        </div>
      `,
    });

    return res.json({ message: 'Đã gửi lại OTP về email' });
  } catch (error: any) {
    console.error('❌ Resend OTP Error:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}

// ===== LOGOUT =====
export async function logout(req: Request, res: Response) {
  try {
    deleteSession(res);
    return res.json({ message: 'Đăng xuất thành công' });
  } catch (error: any) {
    console.error('❌ Logout Error:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}


