import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MasterAssignmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MasterAssignmentUncheckedCreateInput) {
    return this.prisma.masterAssignment.create({
      data,
      include: { subject: true },
    });
  }

  async findAll() {
    return this.prisma.masterAssignment.findMany({
      include: { subject: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.masterAssignment.findUnique({
      where: { id },
      include: { subject: true, assignments: true },
    });
  }

  async update(id: string, data: Prisma.MasterAssignmentUncheckedUpdateInput) {
    return this.prisma.masterAssignment.update({
      where: { id },
      data,
      include: { subject: true },
    });
  }

  async remove(id: string) {
    return this.prisma.masterAssignment.delete({
      where: { id },
    });
  }
}
