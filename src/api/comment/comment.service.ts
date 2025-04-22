import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';
import { AssignmentsService } from '../../assignments/assignments.service';
import { CreateCommentDTO } from './dto/comment.dto';
import { ReviewService } from '../review/review.service';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository,
              private readonly assignmentService: AssignmentsService,
              private readonly reviewService: ReviewService,) {}

  async create(req: CreateCommentDTO, user: JwtPayload) {
    const { content, replyTo, reviewId } = req;
    //check permission
    //user reviewId to find AssignmentId
    const review = await this.reviewService.findById(reviewId);
    const associatedUserIds = this.assignmentService.getAssociatedUserIdsByAssignmentId(review.assignmentId);
    if(!associatedUserIds.includes(user.userId)) {
      throw new UnauthorizedException();
    }
    //find user or group
    // if yes create
    // notify ???
    const comment = await this.commentRepository.create({
      content,replyTo, reviewId
    })
    //notify
    return comment;
  }
}
