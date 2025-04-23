import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        name: dto.name,
        users: {
          connect: dto.userIds.map((id) => ({ id })),
        },
      },
      include: {
        users: true,
      },
    });
  }

  async findAll() {
    return this.prisma.group.findMany({
      include: {
        users: true,
        assignments: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
      include: {
        users: true,
        assignments: true,
      },
    });
  }

  async addMembers(groupId: string, userIds: string[]) {
    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        users: {
          connect: userIds.map((id) => ({ id })),
        },
      },
      include: {
        users: true,
      },
    });
  }

  async removeMembers(groupId: string, userIds: string[]) {
    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        users: {
          disconnect: userIds.map((id) => ({ id })),
        },
      },
      include: {
        users: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.group.delete({
      where: { id },
    });
  }

  async findMemberCount(groupId:string) {
    return this.prisma.user.count({
      where: {
        groupId
      }
    })
  }
}
