import { NotificationType } from '@prisma/client';

interface NotificationStrategy {
  getSubject(): string;

  getContent(): string;

  getHtml(): string;
}

export interface NotificationData {
  name: string;
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
  getSubject(): string {
    return 'Assign to review';
  }

  getContent(): string {
    return 'assign-review';
  }

  getHtml(): string {
    return '';
  }
}

class CommentNotificationStrategy implements NotificationStrategy {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getSubject(): string {
    return 'Comment';
  }

  getContent(): string {
    return 'comment';
  }

  getHtml(): string {
    return '';
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
        return new AssignReviewNotificationStrategy();
      case NotificationType.COMMENT:
        return new CommentNotificationStrategy(data.name);
      case NotificationType.REVIEWED:
        return new ReviewedNotificationStrategy();
    }
  }
}
