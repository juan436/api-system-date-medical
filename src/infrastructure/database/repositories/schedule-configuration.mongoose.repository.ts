import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleConfiguration } from '../../../core/domain/entities/schedule-configuration.entity';
import { IScheduleConfigurationRepository } from '../../../core/domain/repositories/schedule-configuration.repository.interface';
import {
  ScheduleConfigurationModel,
  ScheduleConfigurationDocument,
} from '../schemas/schedule-configuration.schema';
import { ScheduleConfigurationMapper } from '../mappers/schedule-configuration.mapper';

@Injectable()
export class ScheduleConfigurationMongooseRepository implements IScheduleConfigurationRepository {
  constructor(
    @InjectModel(ScheduleConfigurationModel.name)
    private readonly configModel: Model<ScheduleConfigurationDocument>,
  ) {}

  async getConfig(): Promise<ScheduleConfiguration | null> {
    const doc = await this.configModel.findOne();
    return doc ? ScheduleConfigurationMapper.toDomain(doc) : null;
  }

  async upsert(
    data: Omit<ScheduleConfiguration, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ScheduleConfiguration> {
    const doc = await this.configModel.findOneAndUpdate({}, data, {
      upsert: true,
      new: true,
    });
    return ScheduleConfigurationMapper.toDomain(doc);
  }

  async addBlockedDate(date: Date): Promise<ScheduleConfiguration | null> {
    const doc = await this.configModel.findOneAndUpdate(
      {},
      { $addToSet: { fechasBloqueadas: date } },
      { new: true },
    );
    return doc ? ScheduleConfigurationMapper.toDomain(doc) : null;
  }

  async removeBlockedDate(date: Date): Promise<ScheduleConfiguration | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const doc = await this.configModel.findOneAndUpdate(
      {},
      {
        $pull: {
          fechasBloqueadas: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      { new: true },
    );
    return doc ? ScheduleConfigurationMapper.toDomain(doc) : null;
  }
}
