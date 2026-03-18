import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { CheckAvailabilityUseCase } from '../../../core/use-cases/scheduling/check-availability.use-case';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly checkAvailability: CheckAvailabilityUseCase) {}

  @Get()
  async getAvailability(@Query('date') dateStr: string) {
    if (!dateStr) {
      throw new BadRequestException('El parámetro "date" es requerido (YYYY-MM-DD)');
    }

    // Parse as local date (not UTC) to avoid timezone offset shifting the day
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Formato de fecha inválido');
    }

    try {
      return await this.checkAvailability.execute(date);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
