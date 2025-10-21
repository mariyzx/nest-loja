import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export interface UserPayload {
  sub: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(
    email: string,
    inputPassword: string,
  ): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const authUser = await bcrypt.compare(inputPassword, user.password);

    if (!authUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: UserPayload = {
      sub: user.id,
      name: user.name,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
