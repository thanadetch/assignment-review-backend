import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { Request } from 'express';
import { NotificationService } from './notification/notification.service';
import { NotificationType, Role } from '@prisma/client';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile-student')
  @Roles(Role.STUDENT, Role.INSTRUCTOR)
  async getProfile(@Req() req: Request) {
    const user = req.user as { email: string; role: Role };
    await this.notificationService.sendNotification(
      user.email,
      { name: 'test' },
      NotificationType.DUE_DATE,
    );
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile-instructor')
  @Roles(Role.INSTRUCTOR)
  async getProfileInstructor(@Req() req: Request) {
    const user = req.user as { email: string; role: Role };
    await this.notificationService.sendNotification(
      user.email,
      { name: 'test' },
      NotificationType.DUE_DATE,
    );
    return req.user;
  }
}
