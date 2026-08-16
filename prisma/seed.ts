import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rofra.com' },
    update: { role: 'ADMIN', status: 'APPROVED' },
    create: {
      email: 'admin@rofra.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });
  console.log('Default Admin Account Created/Updated:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
