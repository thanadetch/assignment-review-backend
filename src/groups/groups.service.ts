import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from './groups.repository';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddGroupMemberDto } from './dto/add-members-group-dto';
import { RemoveGroupMemberDto } from './dto/delete-members-group-dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepo: GroupRepository) {}

  async create(dto: CreateGroupDto) {
    return this.groupRepo.create(dto);
  }

  async findAll() {
    return this.groupRepo.findAll();
  }

  async findOne(id: number) {
    const group = await this.groupRepo.findById(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.groupRepo.delete(id);
  }

  async addMembers(groupId: number, dto: AddGroupMemberDto) {
    await this.findOne(groupId);
    return this.groupRepo.addMembers(groupId, dto.userIds);
  }

  async removeMembers(groupId: number, dto: RemoveGroupMemberDto) {
    await this.findOne(groupId);
    return this.groupRepo.removeMembers(groupId, dto.userIds);
  }
}
