import { PrismaClient, User } from '@prisma/client';

export const users: User[] = [];

export async function seedUsers(prisma: PrismaClient) {
  try {
    const userUpsertPromises: Promise<User>[] = [];
    users.forEach((user) => {
      userUpsertPromises.push(
        prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        }),
      );
    });

    await Promise.all(userUpsertPromises);
    console.log('Users seeded successfully.');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}
