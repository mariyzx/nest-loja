import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}
  async transform(password: string) {
    const salt = this.configService.get<number>('PASSWORD_SALT') || 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
