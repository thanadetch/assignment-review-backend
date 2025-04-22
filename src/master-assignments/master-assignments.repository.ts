import { Injectable } from '@nestjs/common';
import { CreateMasterAssignmentDto } from './dto/create-master-assignment.dto';
import { UpdateMasterAssignmentDto } from './dto/update-master-assignment.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MasterAssignmentsRepository {
  constructor(private prisma: PrismaService) {
  }

  async create(createDto: CreateMasterAssignmentDto) {
    return this.prisma.masterAssignment.create({
      data: createDto,
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

  async update(id: string, updateDto: UpdateMasterAssignmentDto) {
    return this.prisma.masterAssignment.update({
      where: { id },
      data: updateDto,
      include: { subject: true },
    });
  }

  async remove(id: string) {
    return this.prisma.masterAssignment.delete({
      where: { id },
    });
  }
}
