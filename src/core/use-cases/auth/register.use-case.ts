import { User, UserRole, UserStatus } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

export interface RegisterInput {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  password: string;
  telefono: string;
  whatsapp?: string;
  fechaNacimiento?: Date;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: RegisterInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    return this.userRepository.create({
      nombre: input.nombre,
      apellido: input.apellido,
      cedula: input.cedula,
      email: input.email,
      passwordHash,
      telefono: input.telefono,
      whatsapp: input.whatsapp,
      fechaNacimiento: input.fechaNacimiento,
      rol: UserRole.PACIENTE,
      estado: UserStatus.ACTIVE,
    });
  }
}
