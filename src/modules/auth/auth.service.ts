import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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
  ) { }
  async login(
    email: string,
    inputPassword: string,
  ): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
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

  async register(email: string, inputPassword: string, name: string) {
    const userAlreadyExist = await this.userService.findByEmail(email);
    if (userAlreadyExist) {
      throw new ConflictException('User already exists with this email!');
    }
    const password = await bcrypt.hash(inputPassword, 10);
    const user = await this.userService.create({ email, password, name });
    const payload: UserPayload = {
      sub: user.id,
      name: user.name,
    };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
