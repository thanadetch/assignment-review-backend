import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { NotificationModule } from '../../notification/notification.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { ReviewRepository } from './review.repository';
import { UsersModule } from '../../users/users.module';
import { ReviewController } from './review.controller';
import { AssignmentsModule } from '../../assignments/assignments.module';

@Module({
  imports: [NotificationModule, UsersModule, AssignmentsModule],
  providers: [ReviewService, PrismaService, ReviewRepository],
  controllers: [ReviewController],
  exports: [ReviewService]
})
export class ReviewModule {}
