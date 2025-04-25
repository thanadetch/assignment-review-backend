import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignmentRepository } from './assignment.repository';
import {
  Assignment,
  AssignmentType,
  Group,
  NotificationType,
  Prisma,
  Status,
  User,
} from '@prisma/client';
import { UpdateAssignmentDto } from '../../assignments/dto/update-assignment.dto';
import { AssignReviewersDto } from '../../assignments/dto/assign-reviewers.dto';
import { GroupService } from '../../groups/groups.service';
import { UsersService } from '../../users/users.service';
import { NotificationService } from '../../notification/notification.service';
import { NotificationData } from '../../notification/notification.strategy';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly groupService: GroupService,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationService,
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

    if (isGroupAssignment) {
      await this.sendGroupNotification(groupId, {
        assignmentTitle: submission.masterAssignment.title,
      });
      return this.assignmentRepository.create({
        type: AssignmentType.REVIEW,
        previousAssignmentId: assignmentId,
        content: '',
        status: Status.ASSIGNED,
        masterId: submission.masterId,
        groupId,
      });
    }

    await this.sendNotification(userId, {
      assignmentTitle: submission.masterAssignment.title,
    });
    return this.assignmentRepository.create({
      type: AssignmentType.REVIEW,
      previousAssignmentId: assignmentId,
      content: '',
      status: Status.ASSIGNED,
      masterId: submission.masterId,
      userId,
    });
  }

  async assignRandom(assignmentId: string, dto: AssignReviewersDto) {
    const { isGroupAssignment } = dto;
    const submission = await this.findOne(assignmentId);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    const alreadyReviewsTasks =
      await this.findByPreviousAssignmentId(assignmentId);
    await this.assignmentRepository.update(assignmentId, {
      status: Status.IN_REVIEW,
    });
    if (isGroupAssignment) {
      const groups = await this.groupService.findAll();
      const groupIds = groups.map((g) => g.id);
      if (groupIds.length === 0) {
        return;
      }

      const alreadyAssignedGroupIds = alreadyReviewsTasks
        .map((a) => a.groupId)
        .filter((id) => id != null);

      const alreadyAssignedSet = new Set(alreadyAssignedGroupIds);
      const firstUnassignedId = groupIds.find(
        (id) => !alreadyAssignedSet.has(id),
      );
      if (firstUnassignedId) {
        await this.sendGroupNotification(firstUnassignedId, {
          assignmentTitle: submission.masterAssignment.title,
        });
        return this.assignmentRepository.create({
          type: AssignmentType.REVIEW,
          previousAssignmentId: assignmentId,
          content: '',
          status: Status.ASSIGNED,
          masterId: submission.masterId,
          groupId: firstUnassignedId,
        });
      }

      const reviewCount = new Map<string, number>();
      for (const groupId of alreadyAssignedGroupIds) {
        const currentCount = reviewCount.get(groupId) || 0;
        reviewCount.set(groupId, currentCount + 1);
      }

      let minCount = Infinity;
      let groupsWithLowestCount: string[] = [];
      for (const [groupId, count] of reviewCount.entries()) {
        if (count < minCount) {
          minCount = count;
          groupsWithLowestCount = [groupId];
        } else if (count === minCount) {
          groupsWithLowestCount.push(groupId);
        }
      }
      const assignedGroupId = groupsWithLowestCount[0];
      await this.sendGroupNotification(assignedGroupId, {
        assignmentTitle: submission.masterAssignment.title,
      });
      return this.assignmentRepository.create({
        type: AssignmentType.REVIEW,
        previousAssignmentId: assignmentId,
        content: '',
        status: Status.ASSIGNED,
        masterId: submission.masterId,
        groupId: assignedGroupId,
      });
    } else {
      const students = await this.userService.findStudents();
      const userIds = students.map((s) => s.id);
      const alreadyAssignedUserIds = alreadyReviewsTasks
        .map((a) => a.userId)
        .filter((id) => id != null);

      const alreadyAssignedSet = new Set(alreadyAssignedUserIds);
      const firstUnassignedId = userIds.find(
        (id) => !alreadyAssignedSet.has(id),
      );
      if (firstUnassignedId) {
        await this.sendNotification(firstUnassignedId, {
          assignmentTitle: submission.masterAssignment.title,
        });
        return this.assignmentRepository.create({
          type: AssignmentType.REVIEW,
          previousAssignmentId: assignmentId,
          content: '',
          status: Status.ASSIGNED,
          masterId: submission.masterId,
          userId: firstUnassignedId,
        });
      }
      const reviewCount = new Map<string, number>();
      for (const userId of alreadyAssignedUserIds) {
        const currentCount = reviewCount.get(userId) || 0;
        reviewCount.set(userId, currentCount + 1);
      }

      let minCount = Infinity;
      let userWithLowestCount: string[] = [];
      for (const [userId, count] of reviewCount.entries()) {
        if (count < minCount) {
          minCount = count;
          userWithLowestCount = [userId];
        } else if (count === minCount) {
          userWithLowestCount.push(userId);
        }
      }
      const assignedUserId = userWithLowestCount[0];
      await this.sendNotification(assignedUserId, {
        assignmentTitle: submission.masterAssignment.title,
      });
      return this.assignmentRepository.create({
        type: AssignmentType.REVIEW,
        previousAssignmentId: assignmentId,
        content: '',
        status: Status.ASSIGNED,
        masterId: submission.masterId,
        userId: assignedUserId,
      });
    }
  }

  async giveScore(assignmentId: string, score: number) {
    const assignment = await this.assignmentRepository.findOne(assignmentId);
    if (!assignment) {
      throw new BadRequestException('Assignment not found');
    }
    if (assignment.status != Status.REVIEWED) {
      throw new BadRequestException('Assignment must been reviewed first.');
    }
    return this.assignmentRepository.update(assignmentId, {
      score: score,
      status: Status.COMPLETED,
    });
  }

  async findRelatedAssignment(userId: string, groupId: string) {
    const assignments = await this.assignmentRepository.findBy({
      OR: [{ userId }, { groupId }],
    });
    const assignmentSet = new Set();
    console.log(assignments);
    for (const relatedAssignment of assignments) {
      if (relatedAssignment.type == AssignmentType.SUBMISSION) {
        const reviewAssignments = await this.findReviewsByAssignmentId(
          relatedAssignment.id,
        );
        assignmentSet.add({
          ...relatedAssignment,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
          reviews: reviewAssignments.map(reviewAssignment => (reviewAssignment.reviews))
        });
      } else if (
        relatedAssignment.type == AssignmentType.REVIEW &&
        relatedAssignment.previousAssignmentId
      ) {
        assignmentSet.add({
          assignment: relatedAssignment,
        });
      }
    }
    return Array.from(assignmentSet);
  }

  async findAllByMasterAssignmentId(id: string) {
    return this.assignmentRepository.findBy({
      masterId: id,
    });
  }

  async findAllAvailableReviewers(assignmentId: string) {
    const originalAssignment = await this.findOne(assignmentId);
    const ownerGroupId = originalAssignment.groupId;
    const isGroupAssignment = ownerGroupId != null;
    const { userId } = originalAssignment;
    const alreadyReviewsTasks =
      await this.findByPreviousAssignmentId(assignmentId);
    const availableGroup = await this.getAvailableGroups(
      alreadyReviewsTasks,
      originalAssignment,
    );
    const availableUsers = await this.getAvailableUsers(
      alreadyReviewsTasks,
      originalAssignment,
    );

    //filter owner out
    if (isGroupAssignment) {
      const effectiveUsers = availableUsers.filter(
        (u) => u.groupId != ownerGroupId,
      );
      return {
        groups: availableGroup,
        users: effectiveUsers,
      };
    } else if (userId != null) {
      const ownerUser = await this.userService.findById(userId);
      if (!ownerUser) {
        throw new BadRequestException('User not found');
      }
      const effectiveGroups = availableGroup.filter(
        (g) => g.id != ownerUser.groupId,
      );
      return {
        groups: effectiveGroups,
        users: availableUsers,
      };
    }

    return {
      groups: availableGroup,
      users: availableUsers,
    };
  }

  private async getAvailableGroups(
    assignments: Assignment[],
    originalAssignment: Assignment,
  ): Promise<Group[]> {
    const groups = await this.groupService.findAll();
    const alreadyAssignedGroupIds = assignments
      .map((a) => a.groupId)
      .filter((id) => id != null);

    const alreadyAssignedSet = new Set(alreadyAssignedGroupIds);
    return groups.filter(
      (g) =>
        !alreadyAssignedSet.has(g.id) &&
        !this.isGroupOwner(originalAssignment, g),
    );
  }

  private isGroupOwner(assignment: Assignment, group: Group) {
    return assignment.groupId == group.id;
  }

  private async getAvailableUsers(
    assignments: Assignment[],
    originalAssignment: Assignment,
  ) {
    const users = await this.userService.findStudents();

    const alreadyAssignedUserIds = assignments
      .map((a) => a.userId)
      .filter((id) => id != null);

    const alreadyAssignedSet = new Set(alreadyAssignedUserIds);
    return users.filter(
      (u) =>
        !alreadyAssignedSet.has(u.id) && !this.isOwner(originalAssignment, u),
    );
  }

  private isOwner(assignment: Assignment, user: User) {
    return assignment.userId == user.id;
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

  private async sendGroupNotification(groupId: string, data: NotificationData) {
    await this.notificationService.sendGroupNotification(
      groupId,
      data,
      NotificationType.ASSIGN_REVIEW,
    );
  }

  private async sendNotification(userId: string, data: NotificationData) {
    await this.notificationService.sendNotificationById(
      userId,
      data,
      NotificationType.ASSIGN_REVIEW,
    );
  }

  async findReviewsByAssignmentId(assignmentId: string) {
    const originalAssignment =
      await this.findOne(assignmentId);
    const { type } = originalAssignment;
    if (type == AssignmentType.SUBMISSION) {
      const reviewsAssignments =
        await this.findByPreviousAssignmentId(assignmentId);
      return reviewsAssignments ? reviewsAssignments : [];
    }

    return [originalAssignment];
  }
}
