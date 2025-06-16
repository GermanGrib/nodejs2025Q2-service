import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.login,
      loginDto.password,
    );
    return this.authService.generateTokens(user);
  }

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createUser(createUserDto);
    const tokens = await this.authService.generateTokens(user);

    return {
      id: user.id,
      ...tokens,
    };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
