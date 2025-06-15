import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Убедитесь, что путь правильный
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOneByLogin(login);

    if (user && user.password === password) {
      const { password, ...userWithoutPassword } = user;
      void password;
      return {
        ...userWithoutPassword,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
    }

    throw new UnauthorizedException();
  }

  async generateTokens(user: Omit<User, 'password'>) {
    const payload = { userId: user.id, login: user.login };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    };
  }

  async login(loginDto: any) {
    const user = await this.validateUser(loginDto.login, loginDto.password);
    const payload = { userId: user.id, login: user.login };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return {
        accessToken: this.jwtService.sign({
          userId: payload.userId,
          login: payload.login,
        }),
        refreshToken: this.jwtService.sign(
          { userId: payload.userId, login: payload.login },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
          },
        ),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
