import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/mail/sender";

const prisma = new PrismaClient();

export function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export async function registerBaseUser(email: string, password: string, full_name: string) {
  // Kiểm tra trùng email
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) throw new Error("Email already exists");

  const password_hash = await bcrypt.hash(password, 10);

  // Tạo người dùng cơ bản
  const user = await prisma.users.create({
    data: {
      email,
      password_hash,
      full_name,
      status: "pending",
    },
  });

  // Gửi OTP xác thực
  const otp = generateOTP();
  const expires_at = new Date(Date.now() + 5 * 60 * 1000);

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
      </div>
    `,
  });

  return user;
}

export async function assignRole(user_id: number, role_name: string) {
  const role = await prisma.roles.findUnique({ where: { role_name } });
  if (!role) throw new Error(`Role "${role_name}" not found`);

  await prisma.user_Roles.create({
    data: {
      user_id,
      role_id: role.role_id,
    },
  });
}
