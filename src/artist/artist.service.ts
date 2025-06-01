import { User } from './entities/user.entity';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../common/exceptions/http.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Injectable } from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): Omit<User, 'password'>[] {
    return this.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  findById(id: string): Omit<User, 'password'> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const newUser: User = {
      id: crypto.randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    const user = this.users[userIndex];
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    const updatedUser = {
      ...user,
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    this.users[userIndex] = updatedUser;
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  delete(id: string): void {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(userIndex, 1);
  }
}
