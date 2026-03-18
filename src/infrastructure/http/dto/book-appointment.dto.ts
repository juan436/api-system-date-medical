import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookAppointmentDto {
  @IsNotEmpty()
  @IsString()
  servicioId: string;

  @IsDateString()
  fechaCita: string;

  @IsOptional()
  @IsString()
  notasPaciente?: string;
}
