import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { NotificationModule } from '../../notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [AssignmentService]
})
export class AssignmentModule {}
