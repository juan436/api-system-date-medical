import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../../../core/domain/entities/user.entity';
import { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { UserModel, UserDocument } from '../schemas/user.schema';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserMongooseRepository implements IUserRepository {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const doc = await this.userModel.create(data);
    return UserMapper.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email: email.toLowerCase() });
    return doc ? UserMapper.toDomain(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findById(id);
    return doc ? UserMapper.toDomain(doc) : null;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const docs = await this.userModel.find({ rol: role });
    return docs.map(UserMapper.toDomain);
  }
}
