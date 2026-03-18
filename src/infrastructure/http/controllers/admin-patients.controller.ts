import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { UserRole } from '../../../core/domain/entities/user.entity';
import type { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../core/domain/repositories/user.repository.interface';
import type { IAppointmentRepository } from '../../../core/domain/repositories/appointment.repository.interface';
import { APPOINTMENT_REPOSITORY } from '../../../core/domain/repositories/appointment.repository.interface';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Controller('admin/patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPatientsController {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  @Get()
  async listPatients(
    @Query('q') query = '',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const result = await this.userRepository.searchPatients(query, pageNum, limitNum);

    return {
      ...result,
      data: result.data.map(({ passwordHash, ...rest }) => rest),
    };
  }

  @Get(':id/appointments')
  async getPatientAppointments(@Param('id') id: string) {
    return this.appointmentRepository.findByPacienteId(id);
  }

  @Patch(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    const patient = await this.userRepository.findById(id);
    if (!patient) {
      throw new BadRequestException('Paciente no encontrado');
    }
    if (patient.rol !== UserRole.PACIENTE) {
      throw new BadRequestException('Solo se pueden editar pacientes');
    }

    const updated = await this.userRepository.update(id, {
      ...(dto.nombre !== undefined && { nombre: dto.nombre }),
      ...(dto.apellido !== undefined && { apellido: dto.apellido }),
      ...(dto.telefono !== undefined && { telefono: dto.telefono }),
    });

    if (!updated) {
      throw new BadRequestException('Error al actualizar');
    }

    const { passwordHash, ...result } = updated;
    return result;
  }
}
