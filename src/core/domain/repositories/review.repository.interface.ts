import { Review } from '../entities/review.entity';

export interface IReviewRepository {
  create(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review>;
  findByPacienteId(pacienteId: string): Promise<Review | null>;
  findAll(): Promise<Review[]>;
}

export const REVIEW_REPOSITORY = Symbol('IReviewRepository');
