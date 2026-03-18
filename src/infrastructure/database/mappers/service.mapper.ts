import { Service } from '../../../core/domain/entities/service.entity';
import { ServiceDocument } from '../schemas/service.schema';

export class ServiceMapper {
  static toDomain(doc: ServiceDocument): Service {
    const raw = doc.toObject() as unknown as Record<string, unknown>;
    return {
      id: doc._id.toString(),
      nombre: doc.nombre,
      descripcion: doc.descripcion,
      duracionMinutos: doc.duracionMinutos,
      precioReferencial: doc.precioReferencial,
      estado: doc.estado,
      createdAt: raw.createdAt as Date,
      updatedAt: raw.updatedAt as Date,
    };
  }
}
