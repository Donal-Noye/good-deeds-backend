import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { IUserBody } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  findByTag(tag: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { tag } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getAll(): Promise<IUserBody[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        tag: true,
        email: true,
      },
    });

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      tag: user.tag,
    }));
  }

  async create(email: string, hash: string, salt: string, name: string): Promise<User> {
    const tag = `@${name.toLowerCase().replace(/\s+/g, '')}`;

    return this.prisma.user.create({
      data: {
        email,
        hash,
        salt,
        name,
        tag,
      },
    });
  }

  async update(id: string, body: Prisma.UserUpdateInput): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tag, ...updateData } = body;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
