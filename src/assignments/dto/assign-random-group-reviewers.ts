import { IsOptional, IsNumber, Min } from 'class-validator';

export class AssignRandomGroupReviewersDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  reviewsPerGroup?: number;
}
