import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { SignUpBodyDto } from '../auth/dto/auth.dto';
import { Response } from 'express';
import { CookieService } from '../auth/cookie.service';
import { AuthService } from '../auth/auth.service';
import { IUserBody } from './user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cookieService: CookieService,
    private authService: AuthService,
  ) {}

  @ApiOkResponse()
  @Get('all')
  async getAll(): Promise<IUserBody[]> {
    return this.userService.getAll();
  }

  @ApiProperty()
  @Get(':tag/find')
  async findByTag(@Param('tag') tag: string): Promise<User | null> {
    return this.userService.findByTag(tag);
  }

  @ApiProperty()
  @Get(':id/find')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findByTag(id);
  }

  @Post('create')
  @ApiCreatedResponse()
  async create(
    @Body() body: SignUpBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(
      body.email,
      body.password,
      body.name,
    );

    this.cookieService.setToken(res, accessToken);

    return { accessToken };
  }

  @ApiProperty()
  @Put(':id/update')
  async update(
    @Param('id') id: string,
    @Body() body: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.update(id, body);
  }

  @ApiProperty()
  @Delete(':id/delete')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
