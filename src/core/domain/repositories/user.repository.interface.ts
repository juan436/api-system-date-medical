import { User, UserRole } from '../entities/user.entity';

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
