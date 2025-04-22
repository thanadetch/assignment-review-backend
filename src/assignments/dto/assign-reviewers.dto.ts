import { IsArray, IsString } from 'class-validator';

export class AssignReviewersDto {
  @IsArray()
  @IsString({ each: true })
  reviewerIds: string[];
}
