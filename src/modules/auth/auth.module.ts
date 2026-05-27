import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { AUTH_DEFAULTS } from 'src/common/constants/runtime.constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          secret: config.getOrThrow<string>('jwt.secret'),
          signOptions: {
            expiresIn:
              config.get<string>('jwt.expiresIn') ?? AUTH_DEFAULTS.JWT_EXPIRES_IN,
          },
        }) as JwtModuleOptions,
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
