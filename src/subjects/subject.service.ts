import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectRepository } from './subject.repository';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepo: SubjectRepository) {}

  async create(dto: CreateSubjectDto) {
    return this.subjectRepo.create(dto);
  }

  async findAll() {
    return this.subjectRepo.findAll();
  }

  async findOne(id: string) {
    const subject = await this.subjectRepo.findById(id);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async join(subjectId: string, userId: string) {
    await this.findOne(subjectId); // ensure subject exists
    return this.subjectRepo.joinSubject(subjectId, userId);
  }

  async getUserSubjects(userId: string) {
    // return this.subjectRepo.findEnrollmentsByUser(userId);
  }

  async getSubjectStudents(subjectId: string) {
    await this.findOne(subjectId);
    // return this.subjectRepo.findStudentsBySubjectId(subjectId);
  }
}
