import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { NotificationService } from '../../notification/notification.service';
import { Prisma } from '@prisma/client';
import { UsersService } from '../../users/users.service';
import { CreateReviewDto } from './dto/review.dto';
import { AssignmentService } from '../assignment/assignment.service';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private notificationService: NotificationService,
    private userService: UsersService,
    private assignmentService: AssignmentService,
  ) {}

  getReviewsByAssignmentId(assignmentId: string, email: string) {
    //check permission
    //find assignment
    //find user or group
    //get review and its comment
  }

  async createReview(req: CreateReviewDto, userPayload: JwtPayload) {
    //check permission
    const { userId, group } = userPayload;
    //find assignment
    //if assignment group name or userId = userId, groupName
    await this.reviewRepository.create({
      assignmentId: req.assignmentId,
      userId,
      content: req.content,
    });
    //then notify
  }
}
