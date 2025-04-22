import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MasterAssignmentsService } from './master-assignments.service';
import { CreateMasterAssignmentDto } from './dto/create-master-assignment.dto';
import { UpdateMasterAssignmentDto } from './dto/update-master-assignment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('master-assignments')
@Controller('assignment/master')
export class MasterAssignmentsController {
  constructor(private readonly masterAssignmentsService: MasterAssignmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new master assignment' })
  @ApiResponse({ status: 201, description: 'The master assignment has been successfully created.' })
  create(@Body() createMasterAssignmentDto: CreateMasterAssignmentDto) {
    return this.masterAssignmentsService.create(createMasterAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all master assignments' })
  findAll() {
    return this.masterAssignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a master assignment by id' })
  @ApiResponse({ status: 200, description: 'Return the master assignment.' })
  @ApiResponse({ status: 404, description: 'Master assignment not found.' })
  findOne(@Param('id') id: string) {
    return this.masterAssignmentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a master assignment' })
  @ApiResponse({ status: 200, description: 'The master assignment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Master assignment not found.' })
  update(
    @Param('id') id: string,
    @Body() updateMasterAssignmentDto: UpdateMasterAssignmentDto,
  ) {
    return this.masterAssignmentsService.update(id, updateMasterAssignmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a master assignment' })
  @ApiResponse({ status: 200, description: 'The master assignment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Master assignment not found.' })
  remove(@Param('id') id: string) {
    return this.masterAssignmentsService.remove(id);
  }
}
