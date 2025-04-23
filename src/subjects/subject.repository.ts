import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        name: dto.name,
        id: dto.code,
      },
    });
  }

  async findAll() {
    return this.prisma.subject.findMany();
  }

  async findById(id: string) {
    return this.prisma.subject.findUnique({ where: { id } });
  }

  joinSubject(subjectId: string, userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        subjectId,
      },
    });
  }

  // async findEnrollmentsByUser(userId: string) {
  //   return this.prisma.subjectEnrollment.findMany({
  //     where: { userId },
  //     include: {
  //       subject: true,
  //     },
  //   });
  // }

  // async findStudentsBySubjectId(subjectId: string) {
  //   const subject = await this.prisma.subject.findUnique({
  //     where: { id: subjectId },
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //   });
  //
  //   const enrollments = await this.prisma.subjectEnrollment.findMany({
  //     where: { subjectId },
  //     include: {
  //       user: {
  //         select: {
  //           id: true,
  //           email: true,
  //           firstName: true,
  //           lastName: true,
  //           role: true,
  //           createdAt: true,
  //           updatedAt: true,
  //         },
  //       },
  //     },
  //   });
  //
  //   const users = enrollments.map((e) => e.user);
  //
  //   return {
  //     subject,
  //     users,
  //   };
  // }
}
