import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script tự động xóa các thiết bị đã hết hạn
 * Chạy cronjob hàng ngày: 0 0 * * * (midnight)
 */
async function cleanupExpiredDevices() {
  try {
    console.log('🧹 Starting cleanup of expired trusted devices...');

    const result = await prisma.trusted_Devices.deleteMany({
      where: {
        expires_at: {
          lt: new Date(), // Nhỏ hơn thời gian hiện tại = đã hết hạn
        },
      },
    });

    console.log(`✅ Cleaned up ${result.count} expired devices`);
    
    // Statistics
    const totalDevices = await prisma.trusted_Devices.count();
    const activeDevices = await prisma.trusted_Devices.count({
      where: {
        expires_at: {
          gte: new Date(),
        },
      },
    });

    console.log(`📊 Total trusted devices: ${totalDevices}`);
    console.log(`📊 Active trusted devices: ${activeDevices}`);
    
    return {
      deletedCount: result.count,
      totalDevices,
      activeDevices,
    };
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
cleanupExpiredDevices()
  .then((result) => {
    console.log('✅ Cleanup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  });
