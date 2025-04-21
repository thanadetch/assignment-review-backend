import { Injectable } from '@nestjs/common';
import { NotificationType } from '../common/enums/notification.enum';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { NotificationRepository } from './notification.repository';
import { NotificationData, NotificationStrategyFactory } from './notification.strategy';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async sendNotification(email: string, data: NotificationData, type: NotificationType) {
    const user = await this.userService.findByEmail(email);
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
