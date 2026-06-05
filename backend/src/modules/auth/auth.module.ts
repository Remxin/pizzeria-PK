import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const expiresIn =
          configService.get<string>('jwt.accessExpiresIn') ?? '15m';

        return {
          secret: configService.getOrThrow<string>('jwt.accessSecret'),
          signOptions: {
            expiresIn: expiresIn as JwtModuleOptions['signOptions'] extends {
              expiresIn?: infer E;
            }
              ? E
              : never,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
