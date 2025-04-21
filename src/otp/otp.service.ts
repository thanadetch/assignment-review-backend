import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { OtpRepository } from './otp.repository';
import { Prisma } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository,
              private readonly emailService: EmailService) {}

  async generateOtp(email: string) {
    const code = this.generateSixDigitOtp().toString();
    const hashedCode = await bcrypt.hash(code, 8);
    const ref = this.generateRandomString(6);
    const data = {
      email,
      otpCode: hashedCode,
      ref,
    } as Prisma.OtpChallengeUncheckedCreateInput;
    await this.otpRepository.create(data);

    await this.emailService.sendEmail(
      email, "OTP verification code", '', `<p>OTP: ${code}</p></p><p>ref: ${ref}</p>`
    )
    return ref;
  }

  async challengeOtp(otp: string, ref: string) {
    const otpChallenge = await this.otpRepository.findByRef(ref);
    if(!otpChallenge) {
      throw new UnauthorizedException()
    }
    const result = await bcrypt.compare(otp, otpChallenge.otpCode)
    if(!result) {
      throw new UnauthorizedException()
    }
    return otpChallenge.email
  }

  private generateSixDigitOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private generateRandomString(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
}
