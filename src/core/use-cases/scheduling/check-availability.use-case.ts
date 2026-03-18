import { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { IScheduleConfigurationRepository } from '../../domain/repositories/schedule-configuration.repository.interface';

export interface AvailabilityResult {
  fecha: Date;
  diaSemana: number;
  cuposMaximos: number;
  cuposOcupados: number;
  cuposDisponibles: number;
  disponible: boolean;
}

export class CheckAvailabilityUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly scheduleConfigRepository: IScheduleConfigurationRepository,
  ) {}

  async execute(date: Date): Promise<AvailabilityResult> {
    const config = await this.scheduleConfigRepository.getConfig();
    if (!config) {
      throw new Error('No hay configuración de horarios registrada');
    }

    const dayOfWeek = date.getDay();

    const isBlocked = config.fechasBloqueadas.some(
      (blocked) => this.isSameDay(blocked, date),
    );
    if (isBlocked) {
      return this.buildBlockedResult(date, dayOfWeek);
    }

    const dayConfig = config.diasConfig.find((d) => d.diaSemana === dayOfWeek);
    if (!dayConfig || !dayConfig.activo) {
      return this.buildBlockedResult(date, dayOfWeek);
    }

    const occupiedCount = await this.appointmentRepository.countByDate(date);

    return {
      fecha: date,
      diaSemana: dayOfWeek,
      cuposMaximos: dayConfig.cuposMaximos,
      cuposOcupados: occupiedCount,
      cuposDisponibles: Math.max(0, dayConfig.cuposMaximos - occupiedCount),
      disponible: occupiedCount < dayConfig.cuposMaximos,
    };
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private buildBlockedResult(date: Date, dayOfWeek: number): AvailabilityResult {
    return {
      fecha: date,
      diaSemana: dayOfWeek,
      cuposMaximos: 0,
      cuposOcupados: 0,
      cuposDisponibles: 0,
      disponible: false,
    };
  }
}
