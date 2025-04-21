// src/groups/dto/remove-group-member.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class RemoveGroupMemberDto {
  @ApiProperty({
    description: 'List of user IDs to remove from the group',
    example: ['a1b2c3d4-e5f6-7890-abcd-1234567890ef'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  userIds: string[];
}
