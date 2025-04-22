import { Module } from '@nestjs/common';
import { MasterAssignmentsService } from './master-assignments.service';
import { MasterAssignmentsController } from './master-assignments.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { MasterAssignmentsRepository } from './master-assignments.repository';

@Module({
  controllers: [MasterAssignmentsController],
  providers: [MasterAssignmentsService, MasterAssignmentsRepository, PrismaService],
})
export class MasterAssignmentsModule {
}
