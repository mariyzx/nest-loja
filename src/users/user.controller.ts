import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { v4 as uuid } from 'uuid';
import { ListUserDTO } from './dto/ListUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  @Post()
  async create(@Body() userData: CreateUserDTO) {
    const userEntity = new UserEntity();

    userEntity.email = userData.email;
    userEntity.password = userData.password;
    userEntity.name = userData.name;
    userEntity.id = uuid();

    await this.userService.create(userEntity);
    return {
      user: new ListUserDTO(userEntity.id, userEntity.name),
      message: 'User created successfully!',
    };
  }

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() newData: UpdateUserDTO) {
    const updatedUser = await this.userService.update(id, newData);

    return {
      user: updatedUser,
      message: 'User updated successfully!',
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const removedUser = await this.userService.delete(id);
    if (!removedUser || removedUser === undefined) {
      throw new Error('User not found');
    }
    const user = new ListUserDTO(removedUser.id, removedUser.name);

    return {
      user: user,
      message: 'User deleted successfully!',
    };
  }
}
