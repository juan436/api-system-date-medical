import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { BookAppointmentUseCase } from '../../../core/use-cases/scheduling/book-appointment.use-case';
import { BookAppointmentDto } from '../dto/book-appointment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AppointmentStatus } from '../../../core/domain/entities/appointment.entity';
import type { IAppointmentRepository } from '../../../core/domain/repositories/appointment.repository.interface';
import { APPOINTMENT_REPOSITORY } from '../../../core/domain/repositories/appointment.repository.interface';
import { Inject } from '@nestjs/common';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(
    private readonly bookAppointment: BookAppointmentUseCase,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  @Post()
  async create(
    @Body() dto: BookAppointmentDto,
    @Request() req: { user: { id: string } },
  ) {
    try {
      return await this.bookAppointment.execute({
        pacienteId: req.user.id,
        servicioId: dto.servicioId,
        fechaCita: (() => {
          const [y, m, d] = dto.fechaCita.split('-').map(Number);
          return new Date(y, m - 1, d);
        })(),
        notasPaciente: dto.notasPaciente,
      });
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get('my')
  async getMyAppointments(@Request() req: { user: { id: string } }) {
    return this.appointmentRepository.findByPacienteId(req.user.id);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new BadRequestException('Cita no encontrada');
    }
    if (appointment.pacienteId !== req.user.id) {
      throw new BadRequestException('No tienes permiso para cancelar esta cita');
    }
    if (appointment.estado === AppointmentStatus.CANCELADA) {
      throw new BadRequestException('La cita ya está cancelada');
    }

    return this.appointmentRepository.update(id, {
      estado: AppointmentStatus.CANCELADA,
    });
  }
}
