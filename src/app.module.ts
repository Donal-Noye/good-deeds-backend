import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GoodDeedModule } from './good-deed/good-deed.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [AuthModule, UserModule, GoodDeedModule, FriendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
