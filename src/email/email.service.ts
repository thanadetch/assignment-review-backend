import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, subject: string, content: string, html: string){
    await this.mailerService.sendMail({
      to: email,
      from: process.env.EMAIL_FROM,
      subject,
      text: content,
      html,
    });
  }
}
