import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { UserRole } from '../../../core/domain/entities/user.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { ServiceStatus } from '../../../core/domain/entities/service.entity';
import type { IServiceRepository } from '../../../core/domain/repositories/service.repository.interface';
import { SERVICE_REPOSITORY } from '../../../core/domain/repositories/service.repository.interface';

@Controller('services')
export class ServicesController {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  @Get()
  async getAll() {
    return this.serviceRepository.findAllActive();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllAdmin() {
    return this.serviceRepository.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateServiceDto) {
    try {
      return await this.serviceRepository.create({
        ...dto,
        estado: ServiceStatus.ACTIVE,
      });
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() dto: Partial<CreateServiceDto>) {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new BadRequestException('Servicio no encontrado');
    }
    return this.serviceRepository.update(id, dto);
  }

  @Put(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleStatus(@Param('id') id: string) {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new BadRequestException('Servicio no encontrado');
    }
    const newStatus = service.estado === ServiceStatus.ACTIVE
      ? ServiceStatus.INACTIVE
      : ServiceStatus.ACTIVE;
    return this.serviceRepository.update(id, { estado: newStatus });
  }
}
