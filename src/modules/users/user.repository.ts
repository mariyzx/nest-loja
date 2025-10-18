import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { IUserRepository } from './interface/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(userData: UserEntity): Promise<UserEntity> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async existsWithEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // Evita atualizar o ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...dataToUpdate } = userData;

    Object.assign(user, dataToUpdate);

    return await this.repository.save(user);
  }

  async delete(id: string): Promise<UserEntity> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.repository.delete(id);

    return user;
  }
}
