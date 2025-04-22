import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { UpdateAssignmentStatusDto } from './dto/update-assignment-status.dto';
import { AssignReviewersDto } from './dto/assign-reviewers.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAssignmentStatusDto,
  ) {
    return this.assignmentsService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/assign-reviewers')
  assignReviewers(
    @Param('id') assignmentId: string,
    @Body() dto: AssignReviewersDto,
  ) {
    return this.assignmentsService.assignReviewers(assignmentId, dto);
  }

  @Post(':id/assign-reviewers/random')
  assignRandomReviewers(@Param('id') subjectId: string) {
    return this.assignmentsService.assignRandomReviewers(subjectId);
  }

  @Post(':id/assign-reviewers/random-group')
  assignRandomGroupReviewers(@Param('id') subjectId: string) {
    return this.assignmentsService.assignRandomGroupReviewers(subjectId);
  }

  @Get(':id/reviewers')
  findReviewers(@Param('id') assignmentId: string) {
    return this.assignmentsService.getReviewers(assignmentId);
  }

  @Get('/review/:id')
  findReviewById(@Param('id') reviewId: string) {
    return this.assignmentsService.getReviewById(reviewId);
  }
}
