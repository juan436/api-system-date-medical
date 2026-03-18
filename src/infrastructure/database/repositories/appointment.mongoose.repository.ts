import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from '../../../core/domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../core/domain/entities/appointment.entity';
import { IAppointmentRepository } from '../../../core/domain/repositories/appointment.repository.interface';
import { AppointmentModel, AppointmentDocument } from '../schemas/appointment.schema';
import { AppointmentMapper } from '../mappers/appointment.mapper';

@Injectable()
export class AppointmentMongooseRepository implements IAppointmentRepository {
  constructor(
    @InjectModel(AppointmentModel.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const doc = await this.appointmentModel.create(data);
    return AppointmentMapper.toDomain(doc);
  }

  async findById(id: string): Promise<Appointment | null> {
    const doc = await this.appointmentModel.findById(id);
    return doc ? AppointmentMapper.toDomain(doc) : null;
  }

  async findByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const docs = await this.appointmentModel.find({
      fechaCita: { $gte: startOfDay, $lte: endOfDay },
      estado: { $nin: [AppointmentStatus.CANCELADA] },
    });
    return docs.map(AppointmentMapper.toDomain);
  }

  async findByPacienteId(pacienteId: string): Promise<Appointment[]> {
    const docs = await this.appointmentModel
      .find({ pacienteId })
      .sort({ fechaCita: -1 });
    return docs.map(AppointmentMapper.toDomain);
  }

  async countByDate(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.appointmentModel.countDocuments({
      fechaCita: { $gte: startOfDay, $lte: endOfDay },
      estado: { $nin: [AppointmentStatus.CANCELADA] },
    });
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment | null> {
    const doc = await this.appointmentModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? AppointmentMapper.toDomain(doc) : null;
  }
}
