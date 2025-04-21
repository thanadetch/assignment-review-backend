import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinSubjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}
