import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CookieService } from './cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies[CookieService.tokenKey];

    if (!token) {
      console.log('No token found');
      throw new UnauthorizedException('No token provided');
    }

    try {
      const sessionInfo = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      req['user'] = sessionInfo;
    } catch (error) {
      console.log('Token verification failed', error); // Логируем ошибку
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
