import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Assignment } from '@prisma/client';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsRepository {
  constructor(private prisma: PrismaService) {
  }

  async create(data: CreateAssignmentDto): Promise<Assignment> {
    return this.prisma.assignment.create({
      data,
    });
  }

  async findAll(): Promise<Assignment[]> {
    return this.prisma.assignment.findMany();
  }

  async findOne(id: string): Promise<Assignment | null> {
    return this.prisma.assignment.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateAssignmentDto): Promise<Assignment> {
    return this.prisma.assignment.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Assignment> {
    return this.prisma.assignment.delete({
      where: { id },
    });
  }
}
