import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {
    this.prisma = prisma;
  }

  async createUser(data: Prisma.UserUncheckedCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        group: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        group: true,
      },
    });
  }

  async updateById(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
