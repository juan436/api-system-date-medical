import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../core/use-cases/auth/register.use-case';
import { IPasswordVerifier } from '../../core/use-cases/auth/login.use-case';

@Injectable()
export class PasswordService implements IPasswordHasher, IPasswordVerifier {
  private readonly SALT_ROUNDS = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
