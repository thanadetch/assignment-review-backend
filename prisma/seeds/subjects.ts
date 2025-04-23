import { PrismaClient, Subject } from '@prisma/client';

export const subjects: Subject[] = [
  // {
  //   id: '550e8400-e29b-41d4-a716-446655440000',
  //   name: 'Introduction to Computer Science',
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // },
  // {
  //   id: '550e8400-e29b-41d4-a716-446655440001',
  //   name: 'Web Development Fundamentals',
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Data Structures and Algorithms',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // {
  //   id: '550e8400-e29b-41d4-a716-446655440003',
  //   name: 'Machine Learning',
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // },
  // {
  //   id: '550e8400-e29b-41d4-a716-446655440004',
  //   name: 'Cloud Computing',
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // },
  // {
  //   id: '550e8400-e29b-41d4-a716-446655440005',
  //   name: 'Software Engineering Principles',
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // },
];

export async function seedSubjects(prisma: PrismaClient) {
  try {
    const subjectUpsertPromises: Promise<Subject>[] = [];
    subjects.forEach((subject) => {
      subjectUpsertPromises.push(
        prisma.subject.upsert({
          where: { id: subject.id },
          update: subject,
          create: subject,
        }),
      );
    });

    await Promise.all(subjectUpsertPromises);
    console.log('Subjects seeded successfully.');
  } catch (error) {
    console.error('Error seeding subjects:', error);
  }
}
