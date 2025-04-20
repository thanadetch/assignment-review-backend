import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.NotificationUncheckedCreateInput) {
    return this.prismaService.notification.create({
      data
    })
  }
}
