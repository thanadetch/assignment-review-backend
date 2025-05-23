import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.ReviewUncheckedCreateInput) {
    return this.prismaService.review.create({
      data,
    });
  }

  async findOne(id: string) {
    return this.prismaService.review.findUnique({
      where: { id }
    });
  }

  async findBy(query: Prisma.ReviewWhereInput) {
    return this.prismaService.review.findMany({
      where: query
    })
  }

  async countBy(query: Prisma.ReviewWhereInput) {
    return this.prismaService.review.count({
      where: query
    })
  }

  async findByAssignmentId(assignmentId: string) {
    return this.prismaService.review.findMany({
      where: {
        assignmentId,
      },
      include: {
        comments: true,
      },
    });
  }
}
