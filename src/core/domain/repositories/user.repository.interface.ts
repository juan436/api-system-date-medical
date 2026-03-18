import { User, UserRole } from '../entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
  searchPatients(query: string, page: number, limit: number): Promise<PaginatedResult<User>>;
  update(id: string, data: Partial<User>): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
