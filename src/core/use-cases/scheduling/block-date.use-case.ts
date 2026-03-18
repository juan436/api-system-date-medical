import { ScheduleConfiguration } from '../../domain/entities/schedule-configuration.entity';
import { IScheduleConfigurationRepository } from '../../domain/repositories/schedule-configuration.repository.interface';

export class BlockDateUseCase {
  constructor(
    private readonly scheduleConfigRepository: IScheduleConfigurationRepository,
  ) {}

  async execute(date: Date): Promise<ScheduleConfiguration> {
    const config = await this.scheduleConfigRepository.getConfig();
    if (!config) {
      throw new Error('No hay configuración de horarios registrada');
    }

    const alreadyBlocked = config.fechasBloqueadas.some(
      (blocked) =>
        blocked.getFullYear() === date.getFullYear() &&
        blocked.getMonth() === date.getMonth() &&
        blocked.getDate() === date.getDate(),
    );

    if (alreadyBlocked) {
      throw new Error('La fecha ya está bloqueada');
    }

    const result = await this.scheduleConfigRepository.addBlockedDate(date);
    if (!result) {
      throw new Error('Error al bloquear la fecha');
    }

    return result;
  }
}
