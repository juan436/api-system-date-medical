import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleConfigurationDocument = HydratedDocument<ScheduleConfigurationModel>;

@Schema({ _id: false })
export class DaySlotConfigModel {
  @Prop({ required: true })
  diaSemana: number;

  @Prop({ required: true })
  cuposMaximos: number;

  @Prop({ required: true, default: true })
  activo: boolean;
}

export const DaySlotConfigSchema = SchemaFactory.createForClass(DaySlotConfigModel);

@Schema({ timestamps: true, collection: 'schedule_configuration' })
export class ScheduleConfigurationModel {
  @Prop({ type: [DaySlotConfigSchema], default: [] })
  diasConfig: DaySlotConfigModel[];

  @Prop({ type: [Date], default: [] })
  fechasBloqueadas: Date[];
}

export const ScheduleConfigurationSchema = SchemaFactory.createForClass(ScheduleConfigurationModel);
