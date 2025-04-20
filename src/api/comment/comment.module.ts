import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { NotificationModule } from '../../notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [CommentService]
})
export class CommentModule {}
