import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { SubjectRepository } from './subject.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, SubjectRepository, PrismaService],
})
export class SubjectModule {}
