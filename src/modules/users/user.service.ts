import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { ListUserDTO } from './dto/ListUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userData: CreateUserDTO): Promise<UserEntity> {
    const userEntity = new UserEntity();
    Object.assign(userEntity, userData);

    return await this.userRepository.create(userEntity);
  }

  async getUsers(): Promise<ListUserDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => new ListUserDTO(user.id, user.name));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findByEmail(email);
  }

  async update(id: string, userEntity: UpdateUserDTO): Promise<UserEntity> {
    return await this.userRepository.update(
      id,
      userEntity as Partial<UserEntity>,
    );
  }

  async delete(id: string): Promise<UserEntity> {
    return await this.userRepository.delete(id);
  }
}
