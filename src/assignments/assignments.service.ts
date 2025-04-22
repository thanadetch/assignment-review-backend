import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentsRepository } from './assignments.repository';
import { UpdateAssignmentStatusDto } from './dto/update-assignment-status.dto';
import { Assignment, AssignmentType, Status } from '@prisma/client';
import { AssignReviewersDto } from './dto/assign-reviewers.dto';

@Injectable()
export class AssignmentsService {
  constructor(private repository: AssignmentsRepository) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    return this.repository.create(createAssignmentDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const assignment = await this.repository.findOne(id);
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    await this.findOne(id); // Verify assignment exists
    return this.repository.update(id, updateAssignmentDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Verify assignment exists
    return this.repository.remove(id);
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateAssignmentStatusDto,
  ): Promise<Assignment> {
    return this.repository.update(id, { status: updateStatusDto.status });
  }

  async getReviewById(id: string) {
    return this.repository.findReviewById(id);
  }

  async getReviewers(assignmentId: string) {
    return this.repository.findReviewersByAssignmentId(assignmentId);
  }

  async assignReviewers(assignmentId: string, dto: AssignReviewersDto) {
    const submission = await this.findOne(assignmentId);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const reviewAssignments = await Promise.all(
      dto.reviewerIds.map((userId) =>
        this.repository.create({
          type: AssignmentType.REVIEW,
          content: '',
          status: Status.ASSIGNED,
          masterId: submission.masterId,
          userId,
        }),
      ),
    );

    return Promise.all(
      reviewAssignments.map((reviewAssignment) =>
        this.repository.assignReview(reviewAssignment.id, assignmentId),
      ),
    );
  }

  async assignRandomReviewers(subjectId: string) {
    return this.repository.assignRandomReviewers(subjectId);
  }

  async assignRandomGroupReviewers(subjectId: string) {
    return this.repository.assignRandomGroupReviewers(subjectId);
  }
}
