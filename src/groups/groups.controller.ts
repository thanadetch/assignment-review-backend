import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddGroupMemberDto } from './dto/add-members-group-dto';
import { RemoveGroupMemberDto } from './dto/delete-members-group-dto';

@Controller('group')
export class GroupsController {
  constructor(private readonly groupsService: GroupService) {}

  @Post()
  create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.delete(id);
  }

  @Post(':id/join')
  addMembers(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() dto: AddGroupMemberDto,
  ) {
    return this.groupsService.addMembers(groupId, dto);
  }

  @Delete(':id/join')
  removeMembers(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() dto: RemoveGroupMemberDto,
  ) {
    return this.groupsService.removeMembers(groupId, dto);
  }
}
