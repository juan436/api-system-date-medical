import { IsDateString } from 'class-validator';

export class BlockDateDto {
  @IsDateString()
  fecha: string;
}
