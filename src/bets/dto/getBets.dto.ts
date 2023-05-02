import { IsNotEmpty, IsString } from 'class-validator';

export class GetBetsDto {
  @IsString()
  @IsNotEmpty()
  category: string;
}
