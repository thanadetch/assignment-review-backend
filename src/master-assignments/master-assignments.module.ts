import { Module } from '@nestjs/common';
import { MasterAssignmentsService } from './master-assignments.service';
import { MasterAssignmentsController } from './master-assignments.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { MasterAssignmentsRepository } from './master-assignments.repository';
import { GroupsModule } from '../groups/groups.module';
import { AssignmentModule } from '../api/assignment/assignment.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [GroupsModule, AssignmentModule, UsersModule],
  controllers: [MasterAssignmentsController],
  providers: [
    MasterAssignmentsService,
    MasterAssignmentsRepository,
    PrismaService,
  ],
})
export class MasterAssignmentsModule {}
