import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { NotificationService } from '../../notification/notification.service';
import { UsersService } from '../../users/users.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';
import { AssignmentService } from '../assignment/assignment.service';
import { Status } from '@prisma/client';
import { GroupService } from '../../groups/groups.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private notificationService: NotificationService,
    private userService: UsersService,
    private assignmentService: AssignmentService,
    private groupService: GroupService,
  ) {}
  private readonly logger = new Logger(ReviewService.name);

  async findById(id: string) {
    return this.reviewRepository.findOne(id);
  }

  async create(req: CreateReviewDto, userPayload: JwtPayload) {
    const { userId } = userPayload;
    //TODO change logic for review
    const associatedUserIds =
      await this.assignmentService.getAssociatedUserIdsByAssignmentId(
        req.assignmentId,
      );

    this.logger.log('associatedUserIds', associatedUserIds);
    if (!associatedUserIds.includes(userId)) {
      throw new UnauthorizedException();
    }

    await this.throwIfAlreadyCreate(req.assignmentId, userId);
    const assignment = await this.assignmentService.findOne(req.assignmentId);
    if (!assignment.previousAssignmentId) {
      throw new BadRequestException('Previous assignment Id not exist');
    }
    const originalAssignment = await this.assignmentService.findOne(
      assignment.previousAssignmentId,
    );
    //TODO might update original assignment
    const numAssignedReviews = await this.assignmentService.countBy({
      previousAssignmentId: originalAssignment.id,
    });

    const isGroupAssignment = assignment.groupId != null;
    if (isGroupAssignment && assignment.groupId) {
      this.logger.log('isGroupAssignment');
      await this.reviewRepository.create({
        assignmentId: req.assignmentId,
        userId,
        content: req.content,
      });

      const memberCount = await this.groupService.findMemberCount(
        assignment.groupId,
      );
      const totalReviews = await this.reviewRepository.countBy({
        AND: [{ assignmentId: req.assignmentId }, { userId: userId }],
      });

      if (totalReviews >= memberCount) {
        await this.completeAssignment(assignment.id);
        this.logger.log('Complete assignment');
      }

      const numberOfCompletedAssignmentReviews =
        await this.assignmentService.countBy({
          AND: [
            { previousAssignmentId: originalAssignment.id },
            { status: Status.COMPLETED },
          ],
        });
      this.logger.log('numAssignedReviews', numAssignedReviews);
      this.logger.log(
        'numberOfCompletedAssignmentReviews',
        numberOfCompletedAssignmentReviews,
      );
      if (numberOfCompletedAssignmentReviews >= numAssignedReviews) {
        await this.reviewAssignment(originalAssignment.id);
        this.logger.log('Mark Original assignment as Reviewed');
      }
    } else {
      await this.reviewRepository.create({
        assignmentId: req.assignmentId,
        userId,
        content: req.content,
      });
      await this.completeAssignment(assignment.id);
      await this.reviewAssignment(originalAssignment.id);
    }

    //then notify
    return 'success';
  }

  private async throwIfAlreadyCreate(assignmentId: string, userId: string) {
    const reviews = await this.reviewRepository.findBy({
      AND: [{ assignmentId }, { userId: userId }],
    });
    if (reviews.length > 0) {
      throw new UnauthorizedException('User Already review this assignment');
    }
  }

  private async completeAssignment(assignmentId: string) {
    await this.assignmentService.updateById(assignmentId, {
      status: Status.COMPLETED,
    });
  }

  private async reviewAssignment(assignmentId: string) {
    await this.assignmentService.updateById(assignmentId, {
      status: Status.REVIEWED,
    });
  }
}
