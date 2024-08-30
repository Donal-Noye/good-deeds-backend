import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { GoodDeedService } from './good-deed.service';
import { GoodDeed } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { CreateGoodDeedDto, UpdateGoodDeedDto } from './good-deed.dto';

@Controller('good-deeds')
@UseGuards(AuthGuard)
export class GoodDeedController {
  constructor(private readonly goodDeedService: GoodDeedService) {}

  @Get('all')
  async getAll(@Req() req: RequestWithUser): Promise<GoodDeed[]> {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;

    return this.goodDeedService.getAll(userId);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<GoodDeed | null> {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;

    return this.goodDeedService.findById(id, userId);
  }

  @Post('create')
  async create(@Body() body: CreateGoodDeedDto, @Req() req: RequestWithUser) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;

    return this.goodDeedService.create(userId, body);
  }

  @Put(':id/update')
  async update(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() body: UpdateGoodDeedDto,
  ): Promise<GoodDeed> {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;

    return await this.goodDeedService.update(id, userId, body);
  }

  @Delete(':id/delete')
  async delete(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<GoodDeed> {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.id;

    const goodDeed = await this.goodDeedService.findById(userId, id);
    if (!goodDeed) {
      throw new NotFoundException('Good deed not found');
    }

    return this.goodDeedService.delete(userId, id);
  }
}
