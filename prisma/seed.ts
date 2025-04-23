import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users';
import { seedTeachers } from './seeds/teachers';
import { seedGroups } from './seeds/groups';
import { seedSubjects } from './seeds/subjects';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  await seedSubjects(prisma);
  await seedGroups(prisma);
  await seedTeachers(prisma);
  // await seedUsers(prisma);
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
