export interface DaySlotConfig {
  diaSemana: number; // 0=Domingo, 1=Lunes ... 6=Sábado
  cuposMaximos: number;
  activo: boolean;
}

export interface ScheduleConfiguration {
  id?: string;
  diasConfig: DaySlotConfig[];
  fechasBloqueadas: Date[];
  createdAt?: Date;
  updatedAt?: Date;
}
