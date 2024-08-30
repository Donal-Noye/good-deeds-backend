import { IsBoolean, IsString } from 'class-validator';

export class IFriendBody {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  tag: string;

  @IsString()
  email: string;

  @IsBoolean()
  isFriend: boolean;
}
