import { PrismaClient, User } from '@prisma/client';

export const users: User[] = [
  {
    id: '64cabde4-90ea-4ff0-bd8f-2bbd2b5601b9',
    email: 'test1@test.com',
    firstName: 'firstName1',
    lastName: 'lastName1',
  },
  {
    id: '63478320-cb08-4590-95da-f558ae80ca15',
    email: 'test2@test.com',
    firstName: 'firstName2',
    lastName: 'lastName2',
  },
];

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
