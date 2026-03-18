import { DoctorProfile } from '../../../core/domain/entities/doctor-profile.entity';
import { DoctorProfileDocument } from '../schemas/doctor-profile.schema';

export class DoctorProfileMapper {
  static toDomain(doc: DoctorProfileDocument): DoctorProfile {
    const raw = doc.toObject() as unknown as Record<string, unknown>;
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      nombreCompleto: doc.nombreCompleto,
      titulo: doc.titulo,
      biografia: doc.biografia,
      especialidad: doc.especialidad,
      logrosAcademicos: doc.logrosAcademicos,
      experienciaAnios: doc.experienciaAnios,
      fotoPerfil: doc.fotoPerfil,
      createdAt: raw.createdAt as Date,
      updatedAt: raw.updatedAt as Date,
    };
  }
}
