import { PrismaClient, Group } from '@prisma/client';

export async function seedGroups(prisma: PrismaClient) {
  try {
    const userUpsertPromises: Promise<Group>[] = [];
    const now = new Date();
    const groups: Group[] = [
      {
        id: 1,
        name: 'A',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name:  'B',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: 'C',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name: 'D',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        name: 'Z',
        createdAt: now,
        updatedAt: now,
      },
    ];
    groups.forEach((group) => {
      userUpsertPromises.push(
        prisma.group.upsert({
          where: { id: group.id },
          update: group,
          create: group,
        }),
      );
    });

    await Promise.all(userUpsertPromises);
    console.log('Groups seeded successfully.');
  } catch (error) {
    console.error('Error seeding groups:', error);
  }
}
