import { IsOptional, IsNumber, Min } from 'class-validator';

export class AssignRandomReviewersDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  reviewsPerSubmission?: number;
}
