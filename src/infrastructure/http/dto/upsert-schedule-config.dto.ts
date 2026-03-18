import { IsArray, IsBoolean, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DaySlotConfigDto {
  @IsNumber()
  diaSemana: number;

  @IsNumber()
  @Min(0)
  cuposMaximos: number;

  @IsBoolean()
  activo: boolean;
}

export class UpsertScheduleConfigDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DaySlotConfigDto)
  diasConfig: DaySlotConfigDto[];
}
