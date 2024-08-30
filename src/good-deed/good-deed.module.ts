import { Module } from '@nestjs/common';
import { GoodDeedService } from './good-deed.service';
import { GoodDeedController } from './good-deed.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GoodDeedController],
  providers: [GoodDeedService, PrismaService],
})
export class GoodDeedModule {}
