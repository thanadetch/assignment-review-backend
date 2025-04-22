import { PrismaClient, Group } from '@prisma/client';

export async function seedGroups(prisma: PrismaClient) {
  try {
    const userUpsertPromises: Promise<Group>[] = [];
    const now = new Date();
    const groups: Group[] = [
      {
        id: 'ffe643da-1cc1-4935-86f6-ab02f464f6c7',
        name: 'A',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '78f64c38-e7c8-4488-ac31-3748d579a5a2',
        name:  'B',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '9b5b8f57-f4f8-4960-ab77-cef0626b0c4c',
        name: 'C',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '71ef48f7-1b0d-402e-8cf3-418ebd0f819b',
        name: 'D',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '170e618c-829d-4cff-a84b-1e3320266ba8',
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
