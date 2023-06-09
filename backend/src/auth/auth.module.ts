import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { AchievementService } from 'src/services/achievement.service';
import { AchievementModule } from 'src/modules/achievement.module';
import { MatchModule } from 'src/modules/match.module';
import { TwoFactorAuthController } from './controllers/twoFactorAuth.controller';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';

@Module({
	imports: [HttpModule, JwtModule.register({}), AchievementModule, MatchModule],
	providers: [UserService, AuthService, JwtStrategy, AchievementService, TwoFactorAuthService],
	controllers: [UserController, AuthController, TwoFactorAuthController],
})
export class AuthModule { }
