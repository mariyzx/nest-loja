import { UserEntity } from '../user.entity';

export interface IUserRepository {
  create(userData: UserEntity): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(id: string, userData: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: string): Promise<UserEntity>;
  existsWithEmail(email: string): Promise<boolean>;
}
