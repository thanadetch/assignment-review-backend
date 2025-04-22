import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';
import { CreateCommentDTO } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {

  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCommentDTO, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.commentService.create(dto, user);
  }
}
