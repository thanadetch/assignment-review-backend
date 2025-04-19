import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await seedUsers(prisma);

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
