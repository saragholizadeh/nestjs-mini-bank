import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { EnvironmentConfigService } from 'src/configs/environment-config.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) =>
        ({
          secret: config.jwt.secret,
          signOptions: {
            expiresIn: config.jwt.expiresIn,
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
