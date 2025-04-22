import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AssignmentType, Status } from '@prisma/client';

export class CreateAssignmentDto {
  @IsEnum(AssignmentType)
  @IsNotEmpty()
  type: AssignmentType;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  masterId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  groupId?: string;
}
