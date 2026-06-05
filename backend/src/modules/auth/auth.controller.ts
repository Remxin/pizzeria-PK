import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiAuthRequired } from '../../common/swagger/swagger.decorators';
import type { JwtUser } from '../../common/types/jwt-user.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new client account',
    description:
      'Creates a user with CLIENT role only. Employee and admin accounts must be created by an administrator via POST /users/employee.',
  })
  @ApiCreatedResponse({ description: 'Account created, returns tokens and user data' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ description: 'Returns access token, refresh token, and user data' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Provide a valid refresh token to receive a new token pair. Old refresh token is invalidated.',
  })
  @ApiOkResponse({ description: 'Returns new access and refresh tokens' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiAuthRequired()
  @ApiOperation({
    summary: 'Logout current user',
    description: 'Invalidates refresh token. If refreshToken is omitted, all refresh tokens for the user are removed.',
  })
  @ApiOkResponse({ description: 'Logged out successfully' })
  logout(@CurrentUser() user: JwtUser, @Body() dto: LogoutDto) {
    return this.authService.logout(user.id, dto.refreshToken);
  }
}
