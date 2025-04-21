import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { JoinSubjectDto } from './dto/join-subject.dto';

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
  join(@Param('id') subjectId: string, @Body() dto: JoinSubjectDto) {
    return this.subjectService.join(subjectId, dto.userId);
  }

  @Get('user/:userId')
  getUserSubjects(@Param('userId') userId: string) {
    return this.subjectService.getUserSubjects(userId);
  }
}
