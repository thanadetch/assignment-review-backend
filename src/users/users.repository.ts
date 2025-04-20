import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {
    this.prisma = prisma;
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserFromFirebase(firebaseId: string) {
    return this.prisma.user.findUnique({
      where: { firebaseId },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }
}
