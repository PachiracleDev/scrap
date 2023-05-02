import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { PayloadToken } from './models/token-payload.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailForLogin(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      delete user.password;
      return user;
    }
    return null;
  }

  async generateJWT(payload: PayloadToken) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async signin(user: any) {
    const payload: PayloadToken = {
      sub: user._id,
      role: user.role,
    };

    return {
      access_token: await this.generateJWT(payload),
    };
  }
}
