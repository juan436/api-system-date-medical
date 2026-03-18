import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from '../../config/env.config';
import { UserModel, UserSchema } from '../database/schemas/user.schema';
import { USER_REPOSITORY } from '../../core/domain/repositories/user.repository.interface';
import { UserMongooseRepository } from '../database/repositories/user.mongoose.repository';
import { JwtStrategy } from './jwt.strategy';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { RegisterUseCase } from '../../core/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../core/use-cases/auth/login.use-case';
import { AuthController } from '../http/controllers/auth.controller';

const config = envConfig();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}` },
    }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    PasswordService,
    TokenService,
    {
      provide: USER_REPOSITORY,
      useClass: UserMongooseRepository,
    },
    {
      provide: RegisterUseCase,
      useFactory: (userRepo: UserMongooseRepository, passwordService: PasswordService) =>
        new RegisterUseCase(userRepo, passwordService),
      inject: [USER_REPOSITORY, PasswordService],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepo: UserMongooseRepository,
        passwordService: PasswordService,
        tokenService: TokenService,
      ) => new LoginUseCase(userRepo, passwordService, tokenService),
      inject: [USER_REPOSITORY, PasswordService, TokenService],
    },
  ],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
