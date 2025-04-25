import { NotificationType } from '@prisma/client';
import { HTMLEmailBuilder } from '../email/email.builder';

interface NotificationStrategy {
  getSubject(): string;

  getContent(): string;

  getHtml(): string;
}

export interface NotificationData {
  name?: string;
  assignmentTitle?: string;
  content?: string;
}

class DueDateNotificationStrategy implements NotificationStrategy {
  getSubject(): string {
    return 'Due date';
  }

  getContent(): string {
    return 'due-date';
  }

  getHtml(): string {
    return '';
  }
}

class AssignReviewNotificationStrategy implements NotificationStrategy {
  private readonly assignmentTitle: string;

  constructor(data: NotificationData) {
    this.assignmentTitle = data.assignmentTitle || '';
  }

  getSubject(): string {
    return 'Assign to review';
  }

  getContent(): string {
    return `Please review assignment ${this.assignmentTitle}`;
  }

  getHtml(): string {
    const emailBuilder = new HTMLEmailBuilder();
    emailBuilder
      .addHeading('Please review assignment', 1)
      .addHeading(this.assignmentTitle, 2);
    return emailBuilder.build();
  }
}

class CommentNotificationStrategy implements NotificationStrategy {
  private readonly content: string;
  private readonly name: string;

  constructor(data: NotificationData) {
    this.content = data.content || '';
    this.name = data.name || '';
  }

  getSubject(): string {
    return 'Someone just comment on your review';
  }

  getContent(): string {
    return `${this.name} just commented on your review : ${this.content}`;
  }

  getHtml(): string {
    const emailBuilder = new HTMLEmailBuilder();
    emailBuilder.addHeading(this.name, 3)
      .addParagraph(`: ${this.content}`)
    return emailBuilder.build();
  }
}

class ReviewedNotificationStrategy implements NotificationStrategy {
  getSubject(): string {
    return 'Your assignment has been reviewed';
  }

  getContent(): string {
    return 'reviewed';
  }

  getHtml(): string {
    return '';
  }
}

export class NotificationStrategyFactory {
  getStrategy(
    type: NotificationType,
    data: NotificationData,
  ): NotificationStrategy {
    switch (type) {
      case NotificationType.DUE_DATE:
        return new DueDateNotificationStrategy();
      case NotificationType.ASSIGN_REVIEW:
        return new AssignReviewNotificationStrategy(data);
      case NotificationType.COMMENT:
        return new CommentNotificationStrategy(data);
      case NotificationType.REVIEWED:
        return new ReviewedNotificationStrategy();
    }
  }
}
