import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Get,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { RegisterUseCase } from '../../../core/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../../core/use-cases/auth/login.use-case';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { IUserRepository } from '../../../core/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../core/domain/repositories/user.repository.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const user = await this.registerUseCase.execute(dto);
      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: { user: { id: string } }) {
    const user = await this.userRepository.findById(req.user.id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const { passwordHash, ...profile } = user;
    return profile;
  }
}
