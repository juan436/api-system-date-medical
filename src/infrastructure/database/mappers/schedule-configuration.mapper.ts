import { ScheduleConfiguration } from '../../../core/domain/entities/schedule-configuration.entity';
import { ScheduleConfigurationDocument } from '../schemas/schedule-configuration.schema';

export class ScheduleConfigurationMapper {
  static toDomain(doc: ScheduleConfigurationDocument): ScheduleConfiguration {
    const raw = doc.toObject() as unknown as Record<string, unknown>;
    return {
      id: doc._id.toString(),
      diasConfig: doc.diasConfig.map((d) => ({
        diaSemana: d.diaSemana,
        cuposMaximos: d.cuposMaximos,
        activo: d.activo,
      })),
      fechasBloqueadas: doc.fechasBloqueadas,
      createdAt: raw.createdAt as Date,
      updatedAt: raw.updatedAt as Date,
    };
  }
}
