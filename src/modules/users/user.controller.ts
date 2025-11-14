import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ListUserDTO } from './dto/ListUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserService } from './user.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { PasswordHashPipe } from '../../resources/pipes/password-hash.pipe';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/users')
@ApiTags('users')

export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() { ...userData }: CreateUserDTO,
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
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() newData: UpdateUserDTO) {
    const updatedUser = await this.userService.update(id, newData);

    return {
      user: updatedUser,
      message: 'User updated successfully!',
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    const removedUser = await this.userService.delete(id);

    const user = new ListUserDTO(removedUser.id, removedUser.name);

    return {
      user: user,
      message: 'User deleted successfully!',
    };
  }
}
