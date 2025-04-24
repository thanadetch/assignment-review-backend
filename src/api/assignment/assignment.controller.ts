import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateAssignmentDto } from '../../assignments/dto/update-assignment.dto';
import { AssignmentService } from './assignment.service';
import { AssignReviewersDto, ScoreAssignmentDto } from '../../assignments/dto/assign-reviewers.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  private readonly logger = new Logger(AssignmentController.name);

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  findAllForStudent(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.assignmentService.findRelatedAssignment(
      user.userId,
      user.group,
    );
  }

  @Get('master-assignment/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR)
  findAllByMasterAssignmentId(@Param('id') id: string) {
    return this.assignmentService.findAllByMasterAssignmentId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Patch('submit/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  submit(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentService.submit(id, updateAssignmentDto);
  }

  @Post('assign-reviewers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR)
  assignReviewers(
    @Param('id') assignmentId: string,
    @Body() dto: AssignReviewersDto,
  ) {
    return this.assignmentService.assignReviewers(assignmentId, dto);
  }

  @Post('score/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR)
  scoreAssignment(
    @Param('id') assignmentId: string,
    @Body() dto: ScoreAssignmentDto,
  ) {
    return this.assignmentService.giveScore(assignmentId, dto.score);
  }

  @Post('assign-reviewers/random')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR)
  assignReviewerRandomly(
    @Param('id') assignmentId: string,
    @Body() dto: AssignReviewersDto,
  ) {
    return this.assignmentService.assignRandom(assignmentId, dto);
  }

  @Post('assign-reviewers/rotate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR)
  assignRotate(
    @Param('id') assignmentId: string,
    @Body() dto: AssignReviewersDto,
  ) {
    return this.assignmentService.assignReviewers(assignmentId, dto);
  }

  @Get('submitted-assignments/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR)
  findSubmittedAssignment(@Param('id') id: string) {
    return this.assignmentService.findSubmittedAssignment(id);
  }
}
