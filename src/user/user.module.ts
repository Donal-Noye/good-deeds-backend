import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';
import { PasswordService } from '../auth/password.service';
import { CookieService } from '../auth/cookie.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, PasswordService, CookieService, AuthService],
  exports: [UserService],
})
export class UserModule {}
