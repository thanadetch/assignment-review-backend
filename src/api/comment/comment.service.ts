import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';
import { CreateCommentDTO } from './dto/comment.dto';
import { ReviewService } from '../review/review.service';
import { AssignmentService } from '../assignment/assignment.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly assignmentService: AssignmentService,
    private readonly reviewService: ReviewService,
  ) {}

  async create(req: CreateCommentDTO, user: JwtPayload) {
    const { content, replyTo, reviewId } = req;
    const { userId } = user;
    const review = await this.reviewService.findById(reviewId);
    if (!review) throw new BadRequestException('Review does not exist');
    const associatedUserIds =
      await this.assignmentService.getAssociatedUserIdsByAssignmentId(
        review.assignmentId,
      );
    if (!associatedUserIds.includes(userId)) {
      throw new UnauthorizedException();
    }

    // TODO notify ???
    const comment = await this.commentRepository.create({
      content,
      replyTo,
      reviewId,
      userId,
    });
    //notify
    return comment;
  }
}
