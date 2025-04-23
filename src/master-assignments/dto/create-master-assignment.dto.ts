import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMasterAssignmentDto {
  @ApiProperty({
    description: 'Title of the assignment',
    example: 'Introduction to React',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed instructions for the assignment',
    example: 'Create a simple React application that...',
  })
  @IsNotEmpty()
  @IsString()
  detail: string;

  @ApiProperty({ description: 'ID of the subject this assignment belongs to' })
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  isGroupAssignment: boolean;
}
