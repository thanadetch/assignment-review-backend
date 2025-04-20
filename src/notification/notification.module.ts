import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { NotificationRepository } from './notification.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [EmailModule, UsersModule],
  providers: [NotificationService, NotificationRepository, PrismaService],
  exports: [NotificationService],
})
export class NotificationModule {}
