import prisma from '../utils/prisma';

export class UserService {
  async getUserById(userId: number) {
    return prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        phone_number: true,
        address: true,
        avatar_url: true,
        status: true,
        email_verified: true,
        created_at: true,
        user_roles: {
          include: { role: true },
        },
      },
    });
  }

  async updateUserProfile(userId: number, data: {
    full_name?: string;
    phone_number?: string;
    address?: string;
    avatar_url?: string;
  }) {
    return prisma.users.update({
      where: { user_id: userId },
      data,
    });
  }

  async getUserTrustedDevices(userId: number) {
    return prisma.trusted_Devices.findMany({
      where: { user_id: userId, expires_at: { gte: new Date() } },
      orderBy: { last_used: 'desc' },
    });
  }

  async removeTrustedDevice(deviceId: number, userId: number) {
    return prisma.trusted_Devices.deleteMany({
      where: { device_id: deviceId, user_id: userId },
    });
  }
}

export const userService = new UserService();
