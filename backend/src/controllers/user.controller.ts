import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getTrustedDevices(req: AuthRequest, res: Response) {
  try {
    const user_id = parseInt(req.user!.user_id);

    const devices = await prisma.trusted_Devices.findMany({
      where: {
        user_id,
        expires_at: { gte: new Date() },
      },
      orderBy: { last_used: 'desc' },
    });

    return res.json({ devices });
  } catch (error: any) {
    console.error('❌ Get Trusted Devices Error:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}

export async function deleteTrustedDevice(req: AuthRequest, res: Response) {
  try {
    const user_id = parseInt(req.user!.user_id);
    const device_id = parseInt(req.params.device_id);

    await prisma.trusted_Devices.deleteMany({
      where: {
        device_id,
        user_id,
      },
    });

    return res.json({ message: 'Thiết bị đã được xóa' });
  } catch (error: any) {
    console.error('❌ Delete Trusted Device Error:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}


