import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { generateOTP } from '../utils/mail';

export class AuthService {
  async findUserByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  }

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUserRole(userId: number) {
    return prisma.user_Roles.findFirst({
      where: { user_id: userId },
      include: { role: true },
    });
  }

  async validateRoleAccess(dbRoleName: string, requestedRole: string) {
    const roleMapping: Record<string, string[]> = {
      student: ['student'],
      instructor: ['instructor'],
    };

    const allowedRoles = roleMapping[requestedRole.toLowerCase()] || [];
    return allowedRoles.includes(dbRoleName.toLowerCase());
  }

  async checkTrustedDevice(userId: number, deviceToken: string) {
    return prisma.trusted_Devices.findFirst({
      where: {
        user_id: userId,
        device_token: deviceToken,
        expires_at: { gte: new Date() },
      },
    });
  }

  async updateDeviceLastUsed(deviceId: number) {
    return prisma.trusted_Devices.update({
      where: { device_id: deviceId },
      data: { last_used: new Date() },
    });
  }

  async createOTP(userId: number, purpose: 'login' | 'register' | 'reset_password') {
    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user_OTPs.create({
      data: { user_id: userId, code: otp, purpose, expires_at },
    });

    return { otp, expires_at };
  }

  async verifyOTP(userId: number, code: string, purpose: string) {
    const otpRecord = await prisma.user_OTPs.findFirst({
      where: {
        user_id: userId,
        code,
        purpose,
        expires_at: { gte: new Date() },
      },
    });

    if (otpRecord) {
      await prisma.user_OTPs.delete({ where: { otp_id: otpRecord.otp_id } });
      return true;
    }

    return false;
  }

  async createUser(email: string, password: string, fullName: string) {
    const password_hash = await bcrypt.hash(password, 10);

    return prisma.users.create({
      data: {
        email,
        password_hash,
        full_name: fullName,
        status: 'pending',
      },
    });
  }

  async assignRole(userId: number, roleName: string) {
    const role = await prisma.roles.findUnique({ where: { role_name: roleName } });
    if (!role) throw new Error(`Role "${roleName}" not found`);

    return prisma.user_Roles.create({
      data: { user_id: userId, role_id: role.role_id },
    });
  }

  async activateUser(userId: number) {
    return prisma.users.update({
      where: { user_id: userId },
      data: { status: 'active', email_verified: true },
    });
  }

  async createTrustedDevice(userId: number, deviceToken: string, deviceName: string) {
    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    return prisma.trusted_Devices.create({
      data: {
        user_id: userId,
        device_token: deviceToken,
        device_name: deviceName,
        expires_at,
      },
    });
  }

  async deleteUserPendingAccount(email: string) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (user && user.status === 'pending' && !user.email_verified) {
      await prisma.users.delete({ where: { user_id: user.user_id } });
      return true;
    }
    return false;
  }
}

export const authService = new AuthService();
