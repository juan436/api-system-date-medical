import { Service } from '../entities/service.entity';

export interface IServiceRepository {
  create(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service>;
  findById(id: string): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  findAllActive(): Promise<Service[]>;
  update(id: string, data: Partial<Service>): Promise<Service | null>;
}

export const SERVICE_REPOSITORY = Symbol('IServiceRepository');
