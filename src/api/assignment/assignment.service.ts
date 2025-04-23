import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignmentRepository } from './assignment.repository';
import { Assignment, AssignmentType, Prisma, Status } from '@prisma/client';
import { UpdateAssignmentDto } from '../../assignments/dto/update-assignment.dto';
import { AssignReviewersDto } from '../../assignments/dto/assign-reviewers.dto';
import { GroupService } from '../../groups/groups.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly groupService: GroupService,
    private readonly userService: UsersService,
  ) {}

  async createMany(data: Prisma.AssignmentUncheckedCreateInput[]) {
    return this.assignmentRepository.createMany(data);
  }

  async findOne(id: string) {
    const assignment = await this.assignmentRepository.findOne(id);
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async submit(id: string, dto: UpdateAssignmentDto) {
    await this.findOne(id); // Verify assignment exists
    return this.assignmentRepository.update(id, {
      content: dto.content,
      status: Status.SUBMITTED,
    });
  }

  async assignReviewers(assignmentId: string, dto: AssignReviewersDto) {
    const { isGroupAssignment, userId, groupId } = dto;
    const submission = await this.findOne(assignmentId);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    await this.assignmentRepository.update(assignmentId, {
      status: Status.IN_REVIEW,
    });

    //TODO notification

    if (isGroupAssignment) {
      return this.assignmentRepository.create({
        type: AssignmentType.REVIEW,
        previousAssignmentId: assignmentId,
        content: '',
        status: Status.ASSIGNED,
        masterId: submission.masterId,
        groupId,
      });
    }

    return this.assignmentRepository.create({
      type: AssignmentType.REVIEW,
      previousAssignmentId: assignmentId,
      content: '',
      status: Status.ASSIGNED,
      masterId: submission.masterId,
      userId,
    });
  }

  async findRelatedAssignment(userId: string, groupId: string) {
    return this.assignmentRepository.findBy({
      OR: [{ userId }, { groupId }],
    });
  }

  async findAll() {
    return this.assignmentRepository.findAll()
  }

  async findSubmittedAssignment(masterId: string) {
    return this.assignmentRepository.findBy({
      masterId,
      AND: [{ status: Status.SUBMITTED }],
    });
  }

  async findByPreviousAssignmentId(previousAssignmentId: string) {
    return this.assignmentRepository.findUntilComments({
      previousAssignmentId: previousAssignmentId,
    });
  }

  async updateById(id: string, data: Prisma.AssignmentUncheckedUpdateInput) {
    return this.assignmentRepository.update(id, data);
  }

  async countBy(query: Prisma.AssignmentWhereInput): Promise<number> {
    return this.assignmentRepository.countBy(query);
  }

  // async getAssociatedUserIdsByAssignmentIdV0(assignmentId: string) {
  //   const assignment = await this.assignmentRepository.findOne(assignmentId);
  //   let associatedMembers: string[] = [];
  //   const instructors = await this.userService.findInstructors();
  //   const instructorIds =  instructors.map(x=> x.id)
  //   associatedMembers = associatedMembers.concat(instructorIds);
  //   if (!assignment) throw new BadRequestException('Assignment not found');
  //
  //   //Case review type
  //   if (assignment.type === AssignmentType.REVIEW) {
  //     if (!assignment.previousAssignmentId) throw new BadRequestException('Previous Assignment Id not found');
  //     const originalAssignment = await this.assignmentRepository.findOne(
  //       assignment.previousAssignmentId,
  //     );
  //     if (!originalAssignment) throw new BadRequestException('Original Assignment not found');
  //     const isOriginalGroupAssignment = originalAssignment.groupId != null;
  //     if (isOriginalGroupAssignment && originalAssignment.groupId) {
  //       const memberIds = await this.groupService.findAllMemberIds(
  //         originalAssignment.groupId,
  //       );
  //       associatedMembers = associatedMembers.concat(memberIds);
  //     }
  //     else if (originalAssignment.userId != null) {
  //       associatedMembers = associatedMembers.concat(originalAssignment.userId)
  //     }
  //     const isGroupAssignment = assignment.groupId != null;
  //     if (isGroupAssignment && assignment.groupId) {
  //       const memberIds = await this.groupService.findAllMemberIds(
  //         assignment.groupId,
  //       );
  //       associatedMembers = associatedMembers.concat(memberIds);
  //     }
  //     else if (assignment.userId != null) {
  //       associatedMembers = associatedMembers.concat(assignment.userId)
  //     }
  //   }
  //
  //   //Case not Review Type
  //   const isGroupAssignment = assignment.groupId != null;
  //   if (isGroupAssignment && assignment.groupId) {
  //     const memberIds = await this.groupService.findAllMemberIds(
  //       assignment.groupId,
  //     );
  //     associatedMembers = associatedMembers.concat(memberIds);
  //   }
  //   else if (assignment.userId != null) {
  //     associatedMembers = associatedMembers.concat(assignment.userId)
  //   }
  //
  //   const reviewAssignments = await this.findByPreviousAssignmentId(assignmentId)
  //   for (const a of reviewAssignments) {
  //     const isGroupAssignment = a.groupId != null;
  //     if (isGroupAssignment && a.groupId) {
  //       const memberIds = await this.groupService.findAllMemberIds(
  //         a.groupId,
  //       );
  //       associatedMembers = associatedMembers.concat(memberIds);
  //     }
  //     else if (assignment.userId != null) {
  //       associatedMembers = associatedMembers.concat(assignment.userId)
  //     }
  //   }
  //
  //   return associatedMembers;
  // }

  async getAssociatedUserIdsByAssignmentId(
    assignmentId: string,
  ): Promise<string[]> {
    const assignment = await this.assignmentRepository.findOne(assignmentId);
    if (!assignment) {
      throw new BadRequestException(
        `Assignment with ID ${assignmentId} not found.`,
      );
    }

    const associatedMemberIds = new Set<string>();
    const instructors = await this.userService.findInstructors();
    instructors.forEach((instructor) => associatedMemberIds.add(instructor.id));

    await this.addAssignmentMembersToSet(assignment, associatedMemberIds);

    if (assignment.type === AssignmentType.REVIEW) {
      if (!assignment.previousAssignmentId)
        throw new BadRequestException(
          `Assignment with ID ${assignmentId} not found.`,
        );
      const originalAssignment = await this.assignmentRepository.findOne(
        assignment.previousAssignmentId,
      );
      if (!originalAssignment) {
        throw new BadRequestException('Original Assignment not found');
      }
      await this.addAssignmentMembersToSet(
        originalAssignment,
        associatedMemberIds,
      );
    }

    const subsequentReviewAssignments =
      await this.findByPreviousAssignmentId(assignmentId);
    for (const reviewAssignment of subsequentReviewAssignments) {
      await this.addAssignmentMembersToSet(
        reviewAssignment,
        associatedMemberIds,
      );
    }

    return Array.from(associatedMemberIds);
  }

  private async addAssignmentMembersToSet(
    assignment: Assignment,
    memberIdSet: Set<string>,
  ): Promise<void> {
    if (!assignment) {
      return;
    }
    if (assignment.groupId) {
      const memberIds = await this.groupService.findAllMemberIds(
        assignment.groupId,
      );
      memberIds.forEach((id) => memberIdSet.add(id));
    } else if (assignment.userId) {
      memberIdSet.add(assignment.userId);
    }
  }
}
