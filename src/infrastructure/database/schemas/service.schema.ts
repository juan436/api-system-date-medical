import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ServiceStatus } from '../../../core/domain/entities/service.entity';

export type ServiceDocument = HydratedDocument<ServiceModel>;

@Schema({ timestamps: true, collection: 'services' })
export class ServiceModel {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  duracionMinutos: number;

  @Prop({ required: true })
  precioReferencial: number;

  @Prop({ required: true, enum: ServiceStatus, default: ServiceStatus.ACTIVE })
  estado: ServiceStatus;
}

export const ServiceSchema = SchemaFactory.createForClass(ServiceModel);
