import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
// import { AssignmentsController } from './assignments.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignmentsRepository } from './assignments.repository';

@Module({
  // controllers: [AssignmentsController],
  providers: [AssignmentsService, PrismaService, AssignmentsRepository],
  exports: [AssignmentsService]
})
export class AssignmentsModule {
}
