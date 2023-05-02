import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

//config
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BetsModule } from './bets/bets.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),

    BetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
