import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';
import { Request } from 'express';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  private readonly logger = new Logger(ReviewController.name);

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  async create(@Body() dto: CreateReviewDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.reviewService.create(dto, user);
  }
}
