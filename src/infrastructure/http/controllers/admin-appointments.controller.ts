import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { UserRole } from '../../../core/domain/entities/user.entity';
import { AppointmentStatus } from '../../../core/domain/entities/appointment.entity';
import type { IAppointmentRepository } from '../../../core/domain/repositories/appointment.repository.interface';
import { APPOINTMENT_REPOSITORY } from '../../../core/domain/repositories/appointment.repository.interface';
import type { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../core/domain/repositories/user.repository.interface';
import type { IServiceRepository } from '../../../core/domain/repositories/service.repository.interface';
import { SERVICE_REPOSITORY } from '../../../core/domain/repositories/service.repository.interface';

@Controller('admin/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminAppointmentsController {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  @Get()
  async getByDate(
    @Query('date') dateStr: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: string,
  ) {
    if (!dateStr) {
      throw new BadRequestException('El parámetro "date" es requerido');
    }
    const parts = dateStr.split('-');
    if (parts.length !== 3) {
      throw new BadRequestException('Formato de fecha inválido, usar YYYY-MM-DD');
    }
    const [year, month, day] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Formato de fecha inválido');
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const validStatuses = ['confirmada', 'completada', 'cancelada'];
    const statusFilter = status && validStatuses.includes(status) ? status : undefined;

    const result = await this.appointmentRepository.findByDatePaginated(
      date,
      pageNum,
      limitNum,
      statusFilter,
    );

    const enriched = await Promise.all(
      result.data.map(async (appt) => {
        const [patient, service] = await Promise.all([
          this.userRepository.findById(appt.pacienteId),
          this.serviceRepository.findById(appt.servicioId),
        ]);
        return {
          ...appt,
          pacienteNombre: patient ? `${patient.nombre} ${patient.apellido}` : 'Desconocido',
          pacienteTelefono: patient?.telefono || '',
          servicioNombre: service?.nombre || 'Servicio eliminado',
        };
      }),
    );

    return {
      data: enriched,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get('patient/:pacienteId')
  async getByPatient(@Param('pacienteId') pacienteId: string) {
    const appointments = await this.appointmentRepository.findByPacienteId(pacienteId);

    const enriched = await Promise.all(
      appointments.map(async (appt) => {
        const service = await this.serviceRepository.findById(appt.servicioId);
        return {
          ...appt,
          servicioNombre: service?.nombre || 'Servicio eliminado',
        };
      }),
    );

    return enriched;
  }

  @Patch(':id/complete')
  async markComplete(@Param('id') id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new BadRequestException('Cita no encontrada');
    }
    return this.appointmentRepository.update(id, {
      estado: AppointmentStatus.COMPLETADA,
    });
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new BadRequestException('Cita no encontrada');
    }
    return this.appointmentRepository.update(id, {
      estado: AppointmentStatus.CANCELADA,
    });
  }
}
