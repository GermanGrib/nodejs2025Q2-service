import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../common/exceptions/http.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      void password;
      return {
        ...userWithoutPassword,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
    });
  }

  async findById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    void password;
    return {
      ...userWithoutPassword,
      createdAt: userWithoutPassword.createdAt.getTime(),
      updatedAt: userWithoutPassword.updatedAt.getTime(),
    };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      await this.prisma.user.deleteMany({
        where: { login: createUserDto.login },
      });

      const newUser = await this.prisma.user.create({
        data: {
          login: createUserDto.login,
          password: createUserDto.password,
        },
      });

      return {
        id: newUser.id,
        login: newUser.login,
        version: newUser.version,
        createdAt: newUser.createdAt.getTime(),
        updatedAt: newUser.updatedAt.getTime(),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: { increment: 1 },
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    void password;
    return {
      ...userWithoutPassword,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }

  async delete(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
