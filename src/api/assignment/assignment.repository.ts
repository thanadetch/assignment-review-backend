import { Injectable } from '@nestjs/common';
import { Assignment, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AssignmentUncheckedCreateInput) {
    return this.prisma.assignment.create({
      data,
    });
  }

  async findAll(): Promise<Assignment[]> {
    return this.prisma.assignment.findMany();
  }

  async findBy(query: Prisma.AssignmentWhereInput): Promise<Assignment[]> {
    return this.prisma.assignment.findMany({
      where: query,
      include: {
        masterAssignment: true,
      }
    });
  }

  async findUntilComments(query: Prisma.AssignmentWhereInput) {
    return this.prisma.assignment.findMany({
      where: query,
      include: {
        reviews: {
          include: {
            comments: {
              include: {
                user: true
              }
            }
          }
        },
        group: true,
        user: true,
      }
    });
  }

  async findByGroupId(): Promise<Assignment[]> {
    return this.prisma.assignment.findMany();
  }

  async countBy(query: Prisma.AssignmentWhereInput): Promise<number> {
    return this.prisma.assignment.count({
      where: query,
    })
  }

  async createMany(data: Prisma.AssignmentUncheckedCreateInput[]) {
    return this.prisma.assignment.createMany({
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.assignment.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: true,
            comments: {
              include: {
                user: true
              }
            }
          }
        },
        group: true,
        user: true,
        masterAssignment: true,
      }
    });
  }

  async update(
    id: string,
    data: Prisma.AssignmentUncheckedUpdateInput,
  ): Promise<Assignment> {
    return this.prisma.assignment.update({
      where: { id },
      data,
    });
  }
}
