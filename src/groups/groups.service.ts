import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const groups = await this.groupRepo.findAll()
    return groups.filter(g => g.name != 'Z') // exclude temp group
  }

  async findOne(id: string) {
    const group = await this.groupRepo.findById(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.groupRepo.delete(id);
  }

  async addMembers(groupId: string, dto: AddGroupMemberDto) {
    await this.findOne(groupId);
    return this.groupRepo.addMembers(groupId, dto.userIds);
  }

  async removeMembers(groupId: string, dto: RemoveGroupMemberDto) {
    await this.findOne(groupId);
    return this.groupRepo.removeMembers(groupId, dto.userIds);
  }
  
  async findMemberCount(groupId: string) {
    return this.groupRepo.findMemberCount(groupId);
  }

  async findAllMemberIds(groupId: string) {
    const group = await this.groupRepo.findById(groupId)
    if(!group) throw new BadRequestException();
    const members = group.users
    return members.map(member => member.id)
  }
}
