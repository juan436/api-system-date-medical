import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { UserRole } from '../../../core/domain/entities/user.entity';
import { UpsertScheduleConfigDto } from '../dto/upsert-schedule-config.dto';
import { BlockDateDto } from '../dto/block-date.dto';
import { BlockDateUseCase } from '../../../core/use-cases/scheduling/block-date.use-case';
import type { IScheduleConfigurationRepository } from '../../../core/domain/repositories/schedule-configuration.repository.interface';
import { SCHEDULE_CONFIGURATION_REPOSITORY } from '../../../core/domain/repositories/schedule-configuration.repository.interface';

@Controller('schedule-config')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ScheduleConfigController {
  constructor(
    @Inject(SCHEDULE_CONFIGURATION_REPOSITORY)
    private readonly scheduleConfigRepository: IScheduleConfigurationRepository,
    private readonly blockDateUseCase: BlockDateUseCase,
  ) {}

  @Get()
  async getConfig() {
    return this.scheduleConfigRepository.getConfig();
  }

  @Put()
  async upsertConfig(@Body() dto: UpsertScheduleConfigDto) {
    try {
      return await this.scheduleConfigRepository.upsert({
        diasConfig: dto.diasConfig,
        fechasBloqueadas: [],
      });
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('block-date')
  async blockDate(@Body() dto: BlockDateDto) {
    try {
      return await this.blockDateUseCase.execute(new Date(dto.fecha));
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('unblock-date')
  async unblockDate(@Body() dto: BlockDateDto) {
    const result = await this.scheduleConfigRepository.removeBlockedDate(new Date(dto.fecha));
    if (!result) {
      throw new BadRequestException('Error al desbloquear la fecha');
    }
    return result;
  }
}
