import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GoodDeed } from '@prisma/client';
import { CreateGoodDeedDto, UpdateGoodDeedDto } from './good-deed.dto';

@Injectable()
export class GoodDeedService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string): Promise<GoodDeed[]> {
    return this.prisma.goodDeed.findMany({
      where: {
        userId,
      },
    });
  }

  async findById(userId: string, goodDeedId: string): Promise<GoodDeed | null> {
    return this.prisma.goodDeed.findFirst({
      where: {
        id: goodDeedId,
        userId,
      },
    });
  }

  async create(userId: string, body: CreateGoodDeedDto): Promise<GoodDeed> {
    try {
      return this.prisma.goodDeed.create({
        data: {
          ...body,
          userId,
        },
      });
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to create GoodDeed: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    userId: string,
    body: UpdateGoodDeedDto,
  ): Promise<GoodDeed> {
    try {
      return this.prisma.goodDeed.update({
        where: { id },
        data: {
          ...body,
          userId,
        },
      });
    } catch (error) {
      throw new NotFoundException('Good deed not found');
    }
  }

  async delete(userId: string, deedId: string): Promise<GoodDeed> {
    return this.prisma.goodDeed.delete({
      where: {
        id: deedId,
        userId,
      },
    });
  }
}
