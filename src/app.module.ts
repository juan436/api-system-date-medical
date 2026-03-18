import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from './config/env.config';
import { AuthModule } from './infrastructure/auth/auth.module';
import { SchedulingModule } from './infrastructure/scheduling/scheduling.module';

const config = envConfig();

@Module({
  imports: [
    MongooseModule.forRoot(config.mongodb.uri),
    AuthModule,
    SchedulingModule,
  ],
})
export class AppModule {}
