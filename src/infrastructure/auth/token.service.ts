import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator } from '../../core/use-cases/auth/login.use-case';

@Injectable()
export class TokenService implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: { sub: string; email: string; rol: string }): string {
    return this.jwtService.sign(payload);
  }
}
