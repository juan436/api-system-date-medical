import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole, UserStatus } from '../../../core/domain/entities/user.entity';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ timestamps: true, collection: 'users' })
export class UserModel {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  apellido: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  telefono: string;

  @Prop()
  whatsapp?: string;

  @Prop()
  fechaNacimiento?: Date;

  @Prop({ required: true, enum: UserRole, default: UserRole.PACIENTE })
  rol: UserRole;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
  estado: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
