import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { NotificationRepository } from './notification.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { GroupsModule } from '../groups/groups.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [EmailModule, UsersModule, GroupsModule],
  providers: [NotificationService, NotificationRepository, PrismaService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
