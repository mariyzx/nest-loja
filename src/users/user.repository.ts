import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  private users: UserEntity[] = [];
  async create(userData: UserEntity) {
    this.users.push(userData);

    console.log(this.users);
  }

  async getUsers() {
    console.log(this.users);
    return this.users;
  }

  async existsWithEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  async update(id: string, novosDados: Partial<UserEntity>) {
    const user = this.getById(id);

    Object.entries(novosDados).forEach(([key, value]) => {
      if (key === 'id') {
        return;
      }

      if (value) {
        user[key] = value;
      }
    });

    return user;
  }

  private getById(id: string) {
    const userExists = this.users.find((u) => u.id === id);

    if (!userExists) {
      throw new Error('User not found!');
    }

    return userExists;
  }

  async delete(id: string) {
    const user = this.getById(id);

    this.users = this.users.filter((u) => u.id !== id);
    return user;
  }
}
