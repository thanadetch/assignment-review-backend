import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Assignment, AssignmentType, Status } from '@prisma/client';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssignmentsRepository {
  constructor(private prisma: PrismaService) {}

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

  async findReviewById(reviewId: string) {
    return this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        assignment: true,
        user: true,
        comments: true,
      },
    });
  }

  async findReviewersByAssignmentId(assignmentId: string) {
    return this.prisma.review.findMany({
      where: { assignmentId },
      include: {
        user: true,
      },
    });
  }

  async findGroupSubmissionsBySubject(subjectId: string) {
    return this.prisma.assignment.findMany({
      where: {
        masterAssignment: {
          subjectId,
        },
        type: 'SUBMISSION',
        groupId: {
          not: null,
        },
      },
      include: {
        group: true,
      },
    });
  }

  async findIndividualSubmissionsBySubject(subjectId: string) {
    return this.prisma.assignment.findMany({
      where: {
        masterAssignment: {
          subjectId,
        },
        type: 'SUBMISSION',
        groupId: null,
      },
      include: {
        user: true,
      },
    });
  }


  async assignRandomReviewers(subjectId: string) {
    const submissions =
      await this.findIndividualSubmissionsBySubject(subjectId);
    const reviewers = submissions
      .map((s) => s.userId)
      .filter(Boolean) as string[];

    const reviewAssignments: Assignment[] = [];

    for (const submission of submissions) {
      const possibleReviewers = reviewers.filter(
        (r) => r !== submission.userId,
      );
      const chosen =
        possibleReviewers[Math.floor(Math.random() * possibleReviewers.length)];

      const reviewerAssignment = await this.prisma.assignment.create({
        data: {
          type: 'REVIEW',
          content: '',
          status: 'ASSIGNED',
          masterId: submission.masterId,
          userId: chosen,
        },
      });

      // await this.assignReview(submission.id, reviewerAssignment.id);
      reviewAssignments.push(reviewerAssignment);
    }

    return reviewAssignments;
  }

  async assignRandomGroupReviewers(subjectId: string) {
    const submissions = await this.findGroupSubmissionsBySubject(subjectId);
    const reviewers = submissions
      .map((s) => s.groupId)
      .filter(Boolean) as string[];

    const reviewAssignments: Assignment[] = [];

    for (const submission of submissions) {
      const possibleReviewers = reviewers.filter(
        (r) => r !== submission.groupId,
      );
      const chosen =
        possibleReviewers[Math.floor(Math.random() * possibleReviewers.length)];

      const reviewerAssignment = await this.prisma.assignment.create({
        data: {
          type: 'REVIEW',
          content: '',
          status: 'ASSIGNED',
          masterId: submission.masterId,
          groupId: chosen,
        },
      });

      // await this.assignReview(submission.id, reviewerAssignment.id);
      reviewAssignments.push(reviewerAssignment);
    }

    return reviewAssignments;
  }
}
