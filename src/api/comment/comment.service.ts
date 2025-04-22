import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  create(req: Prisma.CommentUncheckedCreateInput, email: string) {
    //check permission
    //find assignment
    //find user or group
    // if yes create
    // notify ???
  }
}
