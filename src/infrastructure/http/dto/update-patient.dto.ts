import { IsOptional, IsString } from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
