// groups/groups.module.ts
import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupService } from './groups.service';
import { GroupRepository } from './groups.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupService, GroupRepository, PrismaService],
  exports: [GroupService]
})
export class GroupsModule {}
