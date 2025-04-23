import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { JoinSubjectDto } from './dto/join-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectService.create(dto);
  }

  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @Get('/:subjectId')
  getStudents(@Param('subjectId') subjectId: string) {
    return this.subjectService.getSubjectStudents(subjectId);
  }

  @Post(':subjectId/join')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR)
  join(@Param('subjectId') subjectId: string, @Body() dto: JoinSubjectDto) {
    return this.subjectService.join(subjectId, dto.userId);
  }

  @Get('user/:userId')
  getUserSubjects(@Param('userId') userId: string) {
    return this.subjectService.getUserSubjects(userId);
  }
}
