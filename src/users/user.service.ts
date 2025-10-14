import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ListUserDTO } from './dto/ListUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/CreateUser.dto';

export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: CreateUserDTO) {
    const userEntity = new UserEntity();

    userEntity.email = userData.email;
    userEntity.password = userData.password;
    userEntity.name = userData.name;

    const user = await this.userRepository.save(userEntity);
    return user;
  }

  async getUsers() {
    const users = await this.userRepository.find();
    const usersList = users.map((user) => new ListUserDTO(user.id, user.name));

    return usersList;
  }

  async update(id: string, userEntity: UpdateUserDTO) {
    await this.userRepository.update(id, userEntity);
    return 'User updated succesfully!';
  }

  async delete(id: string) {
    const userExist = await this.userRepository.findOne({ where: { id } });
    if (!userExist) {
      return null;
    }

    await this.userRepository.delete(id);

    return userExist;
  }
}
