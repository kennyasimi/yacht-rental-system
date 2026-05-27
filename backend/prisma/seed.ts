import { PrismaClient } from '../src/generated/client'
import * as bcrypt from 'bcrypt';
import {UserRole} from '../src/auth/auth.enums';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const rawPassword = process.env.ADMIN_PASSWORD;

  if (!email || !rawPassword) {
    throw new Error('Please define ADMIN_EMAIL and ADMIN_PASSWORD in your .env file');
  }

  console.log('Starting database seeding...');

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.users.create({
    data: {
      first_name: "your_first_name",
      last_name: "your_last_name",
      phone: "name",
      email: email,
      password_hash: hashedPassword,
      role: UserRole.ADMIN , // Matches your Prisma schema enum/string
      created_at: new Date()
    },
  });

  console.log(`Admin user seeded successfully: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/* This is the admin seeding file.Use to create the firsrt admin.Set the
variables in the env file (DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD).
Make sure the prisma client file path is set correctly to avoid onErrorResumeNext.
Run npx prisma db seed to execute the seeding script. */


