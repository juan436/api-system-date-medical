import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AppointmentStatus } from '../../../core/domain/entities/appointment.entity';

export type AppointmentDocument = HydratedDocument<AppointmentModel>;

@Schema({ timestamps: true, collection: 'appointments' })
export class AppointmentModel {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserModel' })
  pacienteId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ServiceModel' })
  servicioId: Types.ObjectId;

  @Prop({ required: true })
  fechaCita: Date;

  @Prop({ required: true, enum: AppointmentStatus, default: AppointmentStatus.PENDIENTE })
  estado: AppointmentStatus;

  @Prop()
  notasPaciente?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(AppointmentModel);

AppointmentSchema.index({ fechaCita: 1, estado: 1 });
AppointmentSchema.index({ pacienteId: 1 });
