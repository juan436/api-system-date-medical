import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DoctorProfileDocument = HydratedDocument<DoctorProfileModel>;

@Schema({ timestamps: true, collection: 'doctor_profiles' })
export class DoctorProfileModel {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel', unique: true })
  userId: Types.ObjectId;

  @Prop({ default: '' })
  nombreCompleto: string;

  @Prop({ default: '' })
  titulo: string;

  @Prop({ default: '' })
  biografia: string;

  @Prop({ default: '' })
  especialidad: string;

  @Prop({ type: [String], default: [] })
  logrosAcademicos: string[];

  @Prop({ default: 0 })
  experienciaAnios: number;

  @Prop()
  fotoPerfil?: string;
}

export const DoctorProfileSchema = SchemaFactory.createForClass(DoctorProfileModel);
