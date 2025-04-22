import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.CommentUncheckedCreateInput) {
    return this.prismaService.comment.create({
      data
    })
  }
}
