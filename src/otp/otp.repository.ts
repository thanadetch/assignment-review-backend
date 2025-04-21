import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OtpRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.OtpChallengeUncheckedCreateInput) {
    return this.prismaService.otpChallenge.create({ data });
  }

  async findByRef(ref: string) {
    return this.prismaService.otpChallenge.findUnique({
      where: {
        ref: ref,
      },
    });
  }
}
