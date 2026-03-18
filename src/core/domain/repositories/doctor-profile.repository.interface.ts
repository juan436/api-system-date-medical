import { DoctorProfile } from '../entities/doctor-profile.entity';

export interface IDoctorProfileRepository {
  create(profile: Partial<Omit<DoctorProfile, 'id' | 'createdAt' | 'updatedAt'>> & { userId: string }): Promise<DoctorProfile>;
  findByUserId(userId: string): Promise<DoctorProfile | null>;
  findFirst(): Promise<DoctorProfile | null>;
  update(id: string, data: Partial<DoctorProfile>): Promise<DoctorProfile | null>;
}

export const DOCTOR_PROFILE_REPOSITORY = Symbol('IDoctorProfileRepository');
