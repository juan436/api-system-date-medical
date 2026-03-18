import {
  Controller,
  Get,
  Param,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { UserRole } from '../../../core/domain/entities/user.entity';
import type { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../core/domain/repositories/user.repository.interface';
import type { IAppointmentRepository } from '../../../core/domain/repositories/appointment.repository.interface';
import { APPOINTMENT_REPOSITORY } from '../../../core/domain/repositories/appointment.repository.interface';

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
  async listPatients() {
    const patients = await this.userRepository.findByRole(UserRole.PACIENTE);
    return patients.map(({ passwordHash, ...rest }) => rest);
  }

  @Get(':id/appointments')
  async getPatientAppointments(@Param('id') id: string) {
    return this.appointmentRepository.findByPacienteId(id);
  }
}
