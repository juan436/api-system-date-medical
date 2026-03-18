import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<ReviewModel>;

@Schema({ timestamps: true, collection: 'reviews' })
export class ReviewModel {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel', unique: true })
  pacienteId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  calificacion: number;

  @Prop({ required: true })
  comentario: string;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);

ReviewSchema.index({ pacienteId: 1 }, { unique: true });
