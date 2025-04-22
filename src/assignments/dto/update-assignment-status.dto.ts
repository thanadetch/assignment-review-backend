import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateAssignmentStatusDto {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
