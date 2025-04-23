import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './api/review/review.module';
import { CommentModule } from './api/comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import * as process from 'node:process';
import { GroupsModule } from './groups/groups.module';
import { OtpModule } from './otp/otp.module';
import { SubjectModule } from './subjects/subject.module';
import { MasterAssignmentsModule } from './master-assignments/master-assignments.module';
import { AssignmentModule } from './api/assignment/assignment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GroupsModule,
    UsersModule,
    SubjectModule,
    AuthModule,
    ReviewModule,
    CommentModule,
    AssignmentModule,
    NotificationModule,
    EmailModule,
    OtpModule,
    MasterAssignmentsModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
