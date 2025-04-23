import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { NotificationModule } from '../../notification/notification.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { CommentRepository } from './comment.repository';
import { CommentController } from './comment.controller';
import { ReviewModule } from '../review/review.module';
import { AssignmentModule } from '../assignment/assignment.module';
import { GroupsModule } from '../../groups/groups.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [NotificationModule, AssignmentModule, ReviewModule, GroupsModule, UsersModule],
  providers: [CommentService, PrismaService, CommentRepository],
  controllers: [CommentController],
})
export class CommentModule {}
