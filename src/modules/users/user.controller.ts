import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ListUserDTO } from './dto/ListUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserService } from './user.service';
import {
  Cache,
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
} from '@nestjs/cache-manager';
import { PasswordHashPipe } from '../../resources/pipes/password-hash.pipe';

@Controller('/users')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Post()
  async create(
    @Body() { password, ...userData }: CreateUserDTO,
    @Body('password', PasswordHashPipe) hashedPassword: string,
  ) {
    const createdUser = await this.userService.create({
      ...userData,
      password: hashedPassword,
    });
    return {
      user: new ListUserDTO(createdUser.id, createdUser.name),
      message: 'User created successfully!',
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('users:all')
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
