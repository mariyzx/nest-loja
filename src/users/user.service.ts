import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ListUserDTO } from './dto/ListUser.dto';

export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userEntity: UserEntity) {
    await this.userRepository.save(userEntity);
  }

  async getUsers() {
    const users = await this.userRepository.find();
    const usersList = users.map((user) => new ListUserDTO(user.id, user.name));

    return usersList;
  }
}
