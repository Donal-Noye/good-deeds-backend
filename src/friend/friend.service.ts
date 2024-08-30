import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IFriendBody } from './friend.dto';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async addFriend(userId: string, tag: string) {
    const friend = await this.prisma.user.findUnique({
      where: { tag },
    });

    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    if (friend.id === userId) {
      throw new BadRequestException('Cannot add yourself as a friend');
    }

    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        userId,
        friendId: friend.id,
      },
    });

    if (existingFriendship) {
      throw new BadRequestException('Friendship already exists');
    }

    await this.prisma.friendship.upsert({
      where: {
        userId_friendId: {
          userId,
          friendId: friend.id,
        },
      },
      update: {},
      create: {
        userId,
        friendId: friend.id,
      },
    });
  }

  async getAll(
    userId: string,
  ): Promise<IFriendBody[]> {
    return this.prisma.friendship.findMany({
      where: { userId },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            tag: true,
            email: true,
          }
        }
      }
    }).then(friends => friends.map(f => ({
      id: f.friend.id,
      name: f.friend.name,
      tag: f.friend.tag,
      email: f.friend.email,
      isFriend: true
    })));
  }

  async getById(userId: string, friendId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        userId: userId,
        friendId: friendId,
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            tag: true,
            email: true,
            goodDeeds: true
          }
        }
      }
    });

    if (!friendship) {
      throw new NotFoundException('Friend not found');
    }

    return {
      id: friendship.friend.id,
      name: friendship.friend.name,
      tag: friendship.friend.tag,
      email: friendship.friend.email,
      goodDeeds: friendship.friend.goodDeeds,
      isFriend: true
    };
  }

  async removeFriend(userId: string, tag: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const friend = await this.prisma.user.findUnique({
      where: { tag },
    });

    if (!user || !friend) {
      throw new NotFoundException('User or friend not found');
    }

    const deleteResult = await this.prisma.friendship.deleteMany({
      where: {
        userId,
        friendId: friend.id,
      },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException('Friendship not found');
    }
  }
}
