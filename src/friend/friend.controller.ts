import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '@prisma/client';
import { IFriendBody } from './friend.dto';

@Controller('friends')
@UseGuards(AuthGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('add')
  async addFriend(
    @Req() req: RequestWithUser,
    @Body('tag') tag: string,
  ): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;

    await this.friendService.addFriend(userId, tag);
  }

  @ApiOkResponse({
    description: 'Returns a list of friends for the specified user',
    type: [Object],
  })
  @Get('all')
  async getAll(@Req() req: RequestWithUser) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;

    return await this.friendService.getAll(userId);
  }

  @ApiProperty()
  @Get(':friendId/find')
  async findById(
    @Req() req: RequestWithUser,
    @Param('friendId') friendId: string,
  ): Promise<IFriendBody | null> {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;

    return this.friendService.getById(userId, friendId);
  }

  @Delete('remove')
  async removeFriend(
    @Req() req: RequestWithUser,
    @Body('tag') tag: string,
  ): Promise<void> {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user.id;
    await this.friendService.removeFriend(userId, tag);
  }
}
