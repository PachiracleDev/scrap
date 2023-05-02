import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/AuthCredentialsDto.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(@Body() authCredentialsDto: AuthCredentialsDto, @Req() req) {
    const user = req.user;
    return this.authService.signin(user);
  }
}
