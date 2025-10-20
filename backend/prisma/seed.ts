import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Roles
  const roles = [
    { role_name: 'Student', description: 'Sinh Viên' },
    { role_name: 'Instructor', description: 'Giảng Viên' },
    { role_name: 'Admin', description: 'Quản Trị Viên' },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { role_name: role.role_name },
      update: {},
      create: role,
    });
  }

  console.log('✅ Roles seeded successfully');

  const allRoles = await prisma.roles.findMany();
  console.table(allRoles);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
