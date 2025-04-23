import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterAssignmentsRepository } from './master-assignments.repository';
import { CreateMasterAssignmentDto } from './dto/create-master-assignment.dto';
import { GroupService } from '../groups/groups.service';
import { UsersService } from '../users/users.service';
import { AssignmentService } from '../api/assignment/assignment.service';
import { AssignmentType, Status } from '@prisma/client';
import { Prisma } from '.prisma/client';

@Injectable()
export class MasterAssignmentsService {
  constructor(
    private readonly repository: MasterAssignmentsRepository,
    private readonly assignmentService: AssignmentService,
    private readonly groupService: GroupService,
    private readonly userService: UsersService,
  ) {}

  async create(dto: CreateMasterAssignmentDto) {
    const { title, subjectId, detail} = dto
    const master = await this.repository.create({ title, subjectId, detail});
    const { isGroupAssignment } = dto;
    if(isGroupAssignment) {
      const groups = await this.groupService.findAll();
      const data = groups.map(g => {
        return {
          type: AssignmentType.SUBMISSION,
          status: Status.ASSIGNED,
          content: '',
          masterId: master.id,
          groupId: g.id
        }
      });
      await this.assignmentService.createMany(data);
      return 'successfully created for group';
    }
    const users = await this.userService.findStudents();
    const data = users.map(u => {
      return {
        type: AssignmentType.SUBMISSION,
        status: Status.ASSIGNED,
        content: '',
        masterId: master.id,
        userId: u.id
      }
    })
    await this.assignmentService.createMany(data);
    return 'successfully created for individuals'
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

  async update(id: string, data: Prisma.MasterAssignmentUncheckedUpdateInput) {
    await this.findOne(id); // Will throw NotFoundException if not found
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id); // Will throw NotFoundException if not found
    return this.repository.remove(id);
  }
}
