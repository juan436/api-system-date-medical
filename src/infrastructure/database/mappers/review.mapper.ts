import { Review } from '../../../core/domain/entities/review.entity';
import { ReviewDocument } from '../schemas/review.schema';

export class ReviewMapper {
  static toDomain(doc: ReviewDocument): Review {
    const raw = doc.toObject() as unknown as Record<string, unknown>;
    return {
      id: doc._id.toString(),
      pacienteId: doc.pacienteId.toString(),
      calificacion: doc.calificacion,
      comentario: doc.comentario,
      createdAt: raw.createdAt as Date,
      updatedAt: raw.updatedAt as Date,
    };
  }
}
