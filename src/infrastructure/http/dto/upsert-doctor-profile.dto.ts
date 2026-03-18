import { IsString, IsNumber, IsArray, IsOptional, Min } from 'class-validator';

export class UpsertDoctorProfileDto {
  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  biografia?: string;

  @IsOptional()
  @IsString()
  especialidad?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  logrosAcademicos?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  experienciaAnios?: number;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;
}
