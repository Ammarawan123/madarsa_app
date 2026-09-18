import * as bcrypt from 'bcryptjs';
import prisma from './src/config/db';

async function seedUser() {
  const usersToSeed = [
    {
      email: 'ammarashfaq13579@gmail.com',
      plainPassword: '123456',
      fullName: 'Ammar Ashfaq',
      role: 'QARI' as const,
    },
    {
      email: 'muhammadammar13579@gmail.com',
      plainPassword: '123456',
      fullName: 'Muhammad Ammar',
      role: 'PARENT' as const,
    },
  ];

  for (const user of usersToSeed) {
    // Bcrypt hash Node.js environment mein generate karein
    const password_hash = await bcrypt.hash(user.plainPassword, 10);

    await prisma.users.upsert({
      where: { email: user.email },
      update: { password_hash },
      create: {
        email: user.email,
        password_hash,
        role: user.role,
        full_name: user.fullName,
      },
    });

    console.log(`✅ Success! Hash updated in DB for: ${user.email}`);
  }

  console.log('\nLogin Password for both users is: 123456');
}

seedUser()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());