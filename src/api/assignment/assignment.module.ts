import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { AssignmentRepository } from './assignment.repository';
import { GroupsModule } from '../../groups/groups.module';
import { UsersModule } from '../../users/users.module';
import { AssignmentService } from './assignment.service';
import { NotificationModule } from '../../notification/notification.module';

@Module({
  imports: [GroupsModule, AssignmentModule, UsersModule, NotificationModule],
  controllers: [AssignmentController],
  providers: [AssignmentService, PrismaService, AssignmentRepository],
  exports: [AssignmentService],
})
export class AssignmentModule {}
