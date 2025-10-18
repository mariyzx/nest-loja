import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ListUserDTO } from './dto/ListUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { NotFoundException } from '@nestjs/common';

export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: CreateUserDTO) {
    const userEntity = new UserEntity();

    Object.assign(userEntity, userData as UserEntity);

    const user = await this.userRepository.save(userEntity);
    return user;
  }

  async getUsers() {
    const users = await this.userRepository.find();
    const usersList = users.map((user) => new ListUserDTO(user.id, user.name));

    return usersList;
  }

  async update(id: string, userEntity: UpdateUserDTO) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    Object.assign(user, userEntity as UserEntity);
    return this.userRepository.save(user);
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.userRepository.delete(id);
    return user;
  }
}
