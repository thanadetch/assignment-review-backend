import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { NotificationModule } from '../../notification/notification.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { CommentRepository } from './comment.repository';
import { AssignmentsModule } from '../../assignments/assignments.module';
import { CommentController } from './comment.controller';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [NotificationModule, AssignmentsModule, ReviewModule],
  providers: [CommentService, PrismaService, CommentRepository],
  controllers: [CommentController]
})
export class CommentModule {}
