import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsNotEmpty()
  @IsString()
  comentario: string;
}
