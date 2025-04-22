import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { NotificationService } from '../../notification/notification.service';
import { Prisma } from '@prisma/client';
import { UsersService } from '../../users/users.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';
import { AssignmentsService } from '../../assignments/assignments.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private notificationService: NotificationService,
    private userService: UsersService,
    private assignmentService: AssignmentsService,
  ) {}

  getReviewsByAssignmentId(assignmentId: string, email: string) {
    //check permission
    //find assignment
    //find user or group
    //get review and its comment
  }

  async findById(id: string) {
    return this.reviewRepository.findOne(id);
  }

  async create(req: CreateReviewDto, userPayload: JwtPayload) {
    //check permission
    const { userId } = userPayload;
    //find assignment
    const associatedUserIds:string[] = await this.assignmentService.getAssociatedUserIdsByAssignmentId(req.assignmentId)
    if(!associatedUserIds.includes(userId)) {
      throw new UnauthorizedException();
    }
    //if assignment group name or userId = userId, groupName
    await this.reviewRepository.create({
      assignmentId: req.assignmentId,
      userId,
      content: req.content,
    });
    //then notify
  }

}
