import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { NotificationModule } from '../../notification/notification.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [NotificationModule],
  providers: [CommentService, PrismaService, CommentRepository]
})
export class CommentModule {}
