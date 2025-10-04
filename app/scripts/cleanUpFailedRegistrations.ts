import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupPendingUsers() {
  const now = new Date();
  const threshold = new Date(now.getTime() - 15 * 60 * 1000); // 15 phút trước

  // Tìm user pending quá hạn
  const expiredUsers = await prisma.users.findMany({
    where: {
      status: "pending",
      created_at: { lt: threshold },
    },
    select: { user_id: true, email: true },
  });

  if (expiredUsers.length === 0) {
    console.log("✅ No expired pending users found.");
    return;
  }

  const expiredUserIds = expiredUsers.map((u) => u.user_id);

  // Xóa OTP liên quan
  await prisma.user_OTPs.deleteMany({
    where: { user_id: { in: expiredUserIds } },
  });

  // Xóa user
  await prisma.users.deleteMany({
    where: { user_id: { in: expiredUserIds } },
  });

  console.log(`🧹 Deleted ${expiredUsers.length} pending users older than 15 minutes.`);
}

cleanupPendingUsers()
  .catch((err) => console.error("❌ Cleanup error:", err))
  .finally(() => prisma.$disconnect());
