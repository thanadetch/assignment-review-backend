import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { EmailModule } from '../email/email.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [EmailModule],
  providers: [OtpService, OtpRepository, PrismaService],
  exports: [OtpService],
})
export class OtpModule {}
