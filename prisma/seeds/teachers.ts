import { PrismaClient, Role, User } from '@prisma/client';
import * as bcrpytjs from 'bcryptjs';
import { v4 as uuid } from 'uuid';


export async function seedTeachers(prisma: PrismaClient) {
  try {
    const userUpsertPromises: Promise<User>[] = [];
    const pwd = await bcrpytjs.hash("test", 8)
    const users : User[] = [
      {
        id: uuid(),
        email: "teacher@gmail.com",
        firstName: 'teacher',
        lastName: 'teacher',
        role: Role.INSTRUCTOR,
        password: pwd,
        createdAt: new Date(),
        updatedAt: new Date(),
        subjectId: '550e8400-e29b-41d4-a716-446655440002',
        groupId : null,
      }
    ]
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
    console.log('Teachers seeded successfully.');
  } catch (error) {
    console.error('Error seeding teachers:', error);
  }
}
