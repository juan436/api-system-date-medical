import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorProfile } from '../../../core/domain/entities/doctor-profile.entity';
import { IDoctorProfileRepository } from '../../../core/domain/repositories/doctor-profile.repository.interface';
import { DoctorProfileModel, DoctorProfileDocument } from '../schemas/doctor-profile.schema';
import { DoctorProfileMapper } from '../mappers/doctor-profile.mapper';

@Injectable()
export class DoctorProfileMongooseRepository implements IDoctorProfileRepository {
  constructor(
    @InjectModel(DoctorProfileModel.name)
    private readonly profileModel: Model<DoctorProfileDocument>,
  ) {}

  async create(
    data: Partial<Omit<DoctorProfile, 'id' | 'createdAt' | 'updatedAt'>> & { userId: string },
  ): Promise<DoctorProfile> {
    const doc = await this.profileModel.create(data);
    return DoctorProfileMapper.toDomain(doc);
  }

  async findByUserId(userId: string): Promise<DoctorProfile | null> {
    const doc = await this.profileModel.findOne({ userId });
    return doc ? DoctorProfileMapper.toDomain(doc) : null;
  }

  async findFirst(): Promise<DoctorProfile | null> {
    const doc = await this.profileModel.findOne();
    return doc ? DoctorProfileMapper.toDomain(doc) : null;
  }

  async update(id: string, data: Partial<DoctorProfile>): Promise<DoctorProfile | null> {
    const doc = await this.profileModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? DoctorProfileMapper.toDomain(doc) : null;
  }
}
