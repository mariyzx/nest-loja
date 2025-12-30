import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: RegisterDTO })
  @ApiResponse({ status: 200, description: 'Register successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  register(@Body() { email, password, name }: { email: string; password: string; name: string }) {
    return this.authService.register(email, password, name);
  }
}
