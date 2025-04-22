import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterAssignmentsRepository } from './master-assignments.repository';
import { CreateMasterAssignmentDto } from './dto/create-master-assignment.dto';
import { UpdateMasterAssignmentDto } from './dto/update-master-assignment.dto';

@Injectable()
export class MasterAssignmentsService {
  constructor(private repository: MasterAssignmentsRepository) {
  }

  async create(createDto: CreateMasterAssignmentDto) {
    return this.repository.create(createDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const masterAssignment = await this.repository.findOne(id);
    if (!masterAssignment) {
      throw new NotFoundException(`Master assignment with ID ${id} not found`);
    }
    return masterAssignment;
  }

  async update(id: string, updateDto: UpdateMasterAssignmentDto) {
    await this.findOne(id); // Will throw NotFoundException if not found
    return this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Will throw NotFoundException if not found
    return this.repository.remove(id);
  }
}
