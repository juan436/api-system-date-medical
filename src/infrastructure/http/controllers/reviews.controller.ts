import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateReviewDto } from '../dto/create-review.dto';
import type { IReviewRepository } from '../../../core/domain/repositories/review.repository.interface';
import { REVIEW_REPOSITORY } from '../../../core/domain/repositories/review.repository.interface';
import type { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../core/domain/repositories/user.repository.interface';
import type { IAppointmentRepository } from '../../../core/domain/repositories/appointment.repository.interface';
import { APPOINTMENT_REPOSITORY } from '../../../core/domain/repositories/appointment.repository.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: IReviewRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  @Get()
  async getAll() {
    const reviews = await this.reviewRepository.findAll();

    const enriched = await Promise.all(
      reviews.map(async (review) => {
        const patient = await this.userRepository.findById(review.pacienteId);
        const nombre = patient
          ? `${patient.nombre} ${patient.apellido.charAt(0)}.`
          : 'Paciente';
        return {
          ...review,
          pacienteNombre: nombre,
        };
      }),
    );

    return enriched;
  }

  @Get('should-review')
  @UseGuards(JwtAuthGuard)
  async shouldReview(@Request() req: { user: { id: string } }) {
    const existing = await this.reviewRepository.findByPacienteId(req.user.id);
    if (existing) {
      return { shouldReview: false };
    }

    const appointments = await this.appointmentRepository.findByPacienteId(req.user.id);
    const hasCompleted = appointments.some((a) => a.estado === 'completada');

    return { shouldReview: hasCompleted };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateReviewDto,
    @Request() req: { user: { id: string } },
  ) {
    const existing = await this.reviewRepository.findByPacienteId(req.user.id);
    if (existing) {
      throw new BadRequestException('Ya has dejado una reseña.');
    }

    const appointments = await this.appointmentRepository.findByPacienteId(req.user.id);
    const hasCompleted = appointments.some((a) => a.estado === 'completada');
    if (!hasCompleted) {
      throw new BadRequestException('Solo puedes dejar una reseña después de completar una cita.');
    }

    return this.reviewRepository.create({
      pacienteId: req.user.id,
      calificacion: dto.calificacion,
      comentario: dto.comentario,
    });
  }
}
