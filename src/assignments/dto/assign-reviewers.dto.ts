import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AssignReviewersDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  reviewerIds: string[];
}
