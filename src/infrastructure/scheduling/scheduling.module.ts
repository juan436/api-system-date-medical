import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { ServiceModel, ServiceSchema } from '../database/schemas/service.schema';
import { AppointmentModel, AppointmentSchema } from '../database/schemas/appointment.schema';
import {
  ScheduleConfigurationModel,
  ScheduleConfigurationSchema,
} from '../database/schemas/schedule-configuration.schema';
import { DoctorProfileModel, DoctorProfileSchema } from '../database/schemas/doctor-profile.schema';
import { ReviewModel, ReviewSchema } from '../database/schemas/review.schema';

// Repository tokens
import { SERVICE_REPOSITORY } from '../../core/domain/repositories/service.repository.interface';
import { APPOINTMENT_REPOSITORY } from '../../core/domain/repositories/appointment.repository.interface';
import { SCHEDULE_CONFIGURATION_REPOSITORY } from '../../core/domain/repositories/schedule-configuration.repository.interface';
import { DOCTOR_PROFILE_REPOSITORY } from '../../core/domain/repositories/doctor-profile.repository.interface';
import { REVIEW_REPOSITORY } from '../../core/domain/repositories/review.repository.interface';

// Repository implementations
import { ServiceMongooseRepository } from '../database/repositories/service.mongoose.repository';
import { AppointmentMongooseRepository } from '../database/repositories/appointment.mongoose.repository';
import { ScheduleConfigurationMongooseRepository } from '../database/repositories/schedule-configuration.mongoose.repository';
import { DoctorProfileMongooseRepository } from '../database/repositories/doctor-profile.mongoose.repository';
import { ReviewMongooseRepository } from '../database/repositories/review.mongoose.repository';

// Use Cases
import { CheckAvailabilityUseCase } from '../../core/use-cases/scheduling/check-availability.use-case';
import { BookAppointmentUseCase } from '../../core/use-cases/scheduling/book-appointment.use-case';
import { BlockDateUseCase } from '../../core/use-cases/scheduling/block-date.use-case';

// Controllers
import { AvailabilityController } from '../http/controllers/availability.controller';
import { AppointmentsController } from '../http/controllers/appointments.controller';
import { ServicesController } from '../http/controllers/services.controller';
import { ScheduleConfigController } from '../http/controllers/schedule-config.controller';
import { AdminAppointmentsController } from '../http/controllers/admin-appointments.controller';
import { AdminPatientsController } from '../http/controllers/admin-patients.controller';
import { DoctorProfileController } from '../http/controllers/doctor-profile.controller';
import { ReviewsController } from '../http/controllers/reviews.controller';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceModel.name, schema: ServiceSchema },
      { name: AppointmentModel.name, schema: AppointmentSchema },
      { name: ScheduleConfigurationModel.name, schema: ScheduleConfigurationSchema },
      { name: DoctorProfileModel.name, schema: DoctorProfileSchema },
      { name: ReviewModel.name, schema: ReviewSchema },
    ]),
    AuthModule,
  ],
  controllers: [
    AvailabilityController,
    AppointmentsController,
    ServicesController,
    ScheduleConfigController,
    AdminAppointmentsController,
    AdminPatientsController,
    DoctorProfileController,
    ReviewsController,
  ],
  providers: [
    // Repositories
    { provide: SERVICE_REPOSITORY, useClass: ServiceMongooseRepository },
    { provide: APPOINTMENT_REPOSITORY, useClass: AppointmentMongooseRepository },
    { provide: SCHEDULE_CONFIGURATION_REPOSITORY, useClass: ScheduleConfigurationMongooseRepository },
    { provide: DOCTOR_PROFILE_REPOSITORY, useClass: DoctorProfileMongooseRepository },
    { provide: REVIEW_REPOSITORY, useClass: ReviewMongooseRepository },

    // Use Cases
    {
      provide: CheckAvailabilityUseCase,
      useFactory: (
        appointmentRepo: AppointmentMongooseRepository,
        scheduleConfigRepo: ScheduleConfigurationMongooseRepository,
      ) => new CheckAvailabilityUseCase(appointmentRepo, scheduleConfigRepo),
      inject: [APPOINTMENT_REPOSITORY, SCHEDULE_CONFIGURATION_REPOSITORY],
    },
    {
      provide: BookAppointmentUseCase,
      useFactory: (
        appointmentRepo: AppointmentMongooseRepository,
        serviceRepo: ServiceMongooseRepository,
        checkAvailability: CheckAvailabilityUseCase,
      ) => new BookAppointmentUseCase(appointmentRepo, serviceRepo, checkAvailability),
      inject: [APPOINTMENT_REPOSITORY, SERVICE_REPOSITORY, CheckAvailabilityUseCase],
    },
    {
      provide: BlockDateUseCase,
      useFactory: (scheduleConfigRepo: ScheduleConfigurationMongooseRepository) =>
        new BlockDateUseCase(scheduleConfigRepo),
      inject: [SCHEDULE_CONFIGURATION_REPOSITORY],
    },
  ],
  exports: [SERVICE_REPOSITORY, APPOINTMENT_REPOSITORY, SCHEDULE_CONFIGURATION_REPOSITORY, CheckAvailabilityUseCase],
})
export class SchedulingModule {}
