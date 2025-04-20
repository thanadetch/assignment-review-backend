import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { NotificationModule } from '../../notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [ReviewService]
})
export class ReviewModule {}
