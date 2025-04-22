import { PartialType } from '@nestjs/swagger';
import { CreateMasterAssignmentDto } from './create-master-assignment.dto';

export class UpdateMasterAssignmentDto extends PartialType(CreateMasterAssignmentDto) {}
