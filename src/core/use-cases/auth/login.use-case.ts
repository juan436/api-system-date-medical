import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
}

export interface IPasswordVerifier {
  compare(password: string, hash: string): Promise<boolean>;
}

export interface ITokenGenerator {
  generate(payload: { sub: string; email: string; rol: string }): string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordVerifier: IPasswordVerifier,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await this.passwordVerifier.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    const accessToken = this.tokenGenerator.generate({
      sub: user.id!,
      email: user.email,
      rol: user.rol,
    });

    return { user: userWithoutPassword, accessToken };
  }
}
