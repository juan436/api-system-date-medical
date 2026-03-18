import { User } from '../../../core/domain/entities/user.entity';
import { UserDocument } from '../schemas/user.schema';

export class UserMapper {
  static toDomain(doc: UserDocument): User {
    const raw = doc.toObject() as unknown as Record<string, unknown>;
    return {
      id: doc._id.toString(),
      nombre: doc.nombre,
      apellido: doc.apellido,
      email: doc.email,
      passwordHash: doc.passwordHash,
      telefono: doc.telefono,
      whatsapp: doc.whatsapp,
      fechaNacimiento: doc.fechaNacimiento,
      rol: doc.rol,
      estado: doc.estado,
      createdAt: raw.createdAt as Date,
      updatedAt: raw.updatedAt as Date,
    };
  }
}
