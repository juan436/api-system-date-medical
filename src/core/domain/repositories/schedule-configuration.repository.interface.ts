import { ScheduleConfiguration } from '../entities/schedule-configuration.entity';

export interface IScheduleConfigurationRepository {
  getConfig(): Promise<ScheduleConfiguration | null>;
  upsert(config: Omit<ScheduleConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduleConfiguration>;
  addBlockedDate(date: Date): Promise<ScheduleConfiguration | null>;
  removeBlockedDate(date: Date): Promise<ScheduleConfiguration | null>;
}

export const SCHEDULE_CONFIGURATION_REPOSITORY = Symbol('IScheduleConfigurationRepository');
