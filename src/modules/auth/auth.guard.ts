import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from './auth.service';

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

// Guard serve para proteger rotas, verificando se o usuário tem permissão para acessá-las
// Middleware → Guard → Interceptor (before) → Pipe → Controller → Interceptor (after)
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      console.error('Invalid token');
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
