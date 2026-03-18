import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(1)
  duracionMinutos: number;

  @IsNumber()
  @Min(0)
  precioReferencial: number;
}
