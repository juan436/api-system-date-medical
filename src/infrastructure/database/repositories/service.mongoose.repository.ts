import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from '../../../core/domain/entities/service.entity';
import { ServiceStatus } from '../../../core/domain/entities/service.entity';
import { IServiceRepository } from '../../../core/domain/repositories/service.repository.interface';
import { ServiceModel, ServiceDocument } from '../schemas/service.schema';
import { ServiceMapper } from '../mappers/service.mapper';

@Injectable()
export class ServiceMongooseRepository implements IServiceRepository {
  constructor(
    @InjectModel(ServiceModel.name) private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  async create(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const doc = await this.serviceModel.create(data);
    return ServiceMapper.toDomain(doc);
  }

  async findById(id: string): Promise<Service | null> {
    const doc = await this.serviceModel.findById(id);
    return doc ? ServiceMapper.toDomain(doc) : null;
  }

  async findAll(): Promise<Service[]> {
    const docs = await this.serviceModel.find();
    return docs.map(ServiceMapper.toDomain);
  }

  async findAllActive(): Promise<Service[]> {
    const docs = await this.serviceModel.find({ estado: ServiceStatus.ACTIVE });
    return docs.map(ServiceMapper.toDomain);
  }

  async update(id: string, data: Partial<Service>): Promise<Service | null> {
    const doc = await this.serviceModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? ServiceMapper.toDomain(doc) : null;
  }
}
