import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { NotificationRepository } from './notification.repository';
import {
  NotificationData,
  NotificationStrategyFactory,
} from './notification.strategy';
import { NotificationType, User } from '@prisma/client';
import { GroupService } from '../groups/groups.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private readonly groupService: GroupService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async sendNotificationByEmail(
    email: string,
    data: NotificationData,
    type: NotificationType,
  ) {
    const user = await this.userService.findByEmail(email);
    await this.sendNotification(user as User, data, type);
  }

  async sendNotificationById(
    userId: string,
    data: NotificationData,
    type: NotificationType,
  ) {
    const user = await this.userService.findById(userId);
    await this.sendNotification(user as User, data, type);
  }

  async sendGroupNotification(
    groupId: string,
    data: NotificationData,
    type: NotificationType,
  ) {
    const userEmails = await this.groupService.findAllMemberEmails(groupId);
    for (const email of userEmails) {
      await this.sendNotificationByEmail(email, data, type);
    }
  }

  private async sendNotification(
    user: User,
    data: NotificationData,
    type: NotificationType,
  ) {
    if (!user) {
      throw new Error('User not found');
    }
    const strategyFactory = new NotificationStrategyFactory();
    const strategy = strategyFactory.getStrategy(type, data);

    const subject = strategy.getSubject();
    const content = strategy.getContent();
    const html = strategy.getHtml(); // Get HTML from the strategy

    await this.notificationRepository.create({
      userId: user.id,
      content,
      type,
    });
    await this.emailService.sendEmail(user.email, subject, content, html);
  }
}
