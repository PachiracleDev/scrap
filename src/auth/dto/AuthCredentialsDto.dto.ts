import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
