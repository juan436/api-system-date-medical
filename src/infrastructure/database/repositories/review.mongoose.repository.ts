import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../../../core/domain/entities/review.entity';
import { IReviewRepository } from '../../../core/domain/repositories/review.repository.interface';
import { ReviewModel, ReviewDocument } from '../schemas/review.schema';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class ReviewMongooseRepository implements IReviewRepository {
  constructor(
    @InjectModel(ReviewModel.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async create(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const doc = await this.reviewModel.create(data);
    return ReviewMapper.toDomain(doc);
  }

  async findByPacienteId(pacienteId: string): Promise<Review | null> {
    const doc = await this.reviewModel.findOne({ pacienteId });
    return doc ? ReviewMapper.toDomain(doc) : null;
  }

  async findAll(): Promise<Review[]> {
    const docs = await this.reviewModel.find().sort({ createdAt: -1 });
    return docs.map(ReviewMapper.toDomain);
  }
}
