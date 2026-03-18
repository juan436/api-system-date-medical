import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { UserRole } from '../../../core/domain/entities/user.entity';
import { UpsertDoctorProfileDto } from '../dto/upsert-doctor-profile.dto';
import type { IDoctorProfileRepository } from '../../../core/domain/repositories/doctor-profile.repository.interface';
import { DOCTOR_PROFILE_REPOSITORY } from '../../../core/domain/repositories/doctor-profile.repository.interface';

const UPLOADS_DIR = join(process.cwd(), 'uploads');
const PROFILE_DIR = join(UPLOADS_DIR, 'profile');

// Ensure upload directories exist
[UPLOADS_DIR, PROFILE_DIR].forEach((dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

const ALLOWED_MIMES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const imageFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return callback(new BadRequestException('Solo se permiten imágenes JPG y PNG'), false);
  }
  callback(null, true);
};

const profileStorage = diskStorage({
  destination: PROFILE_DIR,
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('doctor-profile')
export class DoctorProfileController {
  constructor(
    @Inject(DOCTOR_PROFILE_REPOSITORY)
    private readonly profileRepo: IDoctorProfileRepository,
  ) {}

  // Public endpoint — landing page fetches this
  @Get()
  async getPublicProfile() {
    const profile = await this.profileRepo.findFirst();
    return profile || {};
  }

  // Admin: get own profile
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAdminProfile(@Request() req: { user: { id: string } }) {
    const profile = await this.profileRepo.findByUserId(req.user.id);
    return profile || {};
  }

  // Admin: create or update profile
  @Put('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async upsertProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: UpsertDoctorProfileDto,
  ) {
    const existing = await this.profileRepo.findByUserId(req.user.id);
    if (existing) {
      return this.profileRepo.update(existing.id!, dto);
    }
    return this.profileRepo.create({ ...dto, userId: req.user.id });
  }

  // Admin: upload profile photo
  @Post('admin/foto-perfil')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: profileStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadProfilePhoto(
    @Request() req: { user: { id: string } },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No se proporcionó un archivo');

    const filePath = `/uploads/profile/${file.filename}`;
    const existing = await this.profileRepo.findByUserId(req.user.id);
    if (existing) {
      await this.profileRepo.update(existing.id!, { fotoPerfil: filePath });
    } else {
      await this.profileRepo.create({
        userId: req.user.id,
        nombreCompleto: '',
        titulo: '',
        biografia: '',
        especialidad: '',
        logrosAcademicos: [],
        experienciaAnios: 0,
        fotoPerfil: filePath,
      });
    }
    return { url: filePath };
  }
}
