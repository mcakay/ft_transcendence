import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { RoomsController } from './rooms/rooms.controller';


@Module({
  imports: [ AuthModule, HttpModule, PrismaModule, JwtModule, ChatModule],
  controllers: [AppController, RoomsController],
  providers: [AppService, AuthService],
})
export class AppModule {}
