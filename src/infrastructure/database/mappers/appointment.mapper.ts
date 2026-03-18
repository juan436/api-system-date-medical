import { Appointment } from '../../../core/domain/entities/appointment.entity';
import { AppointmentDocument } from '../schemas/appointment.schema';

export class AppointmentMapper {
  static toDomain(doc: AppointmentDocument): Appointment {
    const raw = doc.toObject() as unknown as Record<string, unknown>;
    return {
      id: doc._id.toString(),
      pacienteId: doc.pacienteId.toString(),
      servicioId: doc.servicioId.toString(),
      fechaCita: doc.fechaCita,
      estado: doc.estado,
      notasPaciente: doc.notasPaciente,
      createdAt: raw.createdAt as Date,
      updatedAt: raw.updatedAt as Date,
    };
  }
}
