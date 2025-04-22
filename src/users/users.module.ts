import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
