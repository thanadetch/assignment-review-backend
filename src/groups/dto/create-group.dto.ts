import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the group',
    example: 'Testing Group',
  })
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    description: 'List of user IDs to be added to the group',
    example: ['a1b2c3d4-e5f6-7890-1234-abcdefabcdef'],
    type: [String],
  })
  userIds: string[];
}
