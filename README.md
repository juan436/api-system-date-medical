# SystemDate — Backend API

Núcleo del sistema de gestión de citas, construido con **NestJS** y siguiendo una arquitectura robusta y escalable.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture**:
- **Entities**: Definición de los modelos de negocio.
- **Use Cases**: Lógica de aplicación pura.
- **Repositories**: Interfaces y adaptadores para la persistencia de datos (MongoDB).
- **Infrastructure**: Implementaciones técnicas (NestJS modules, controllers, schemas).

## 🚀 Tecnologías

- **Framework**: NestJS 11
- **DB**: MongoDB + Mongoose
- **Auth**: Passport + JWT + Bcrypt
- **Validación**: Class-validator + Class-transformer
- **Files**: Integración con Multer para subida de imágenes (perfil).

## 🛠️ Instalación y Uso

1. Instalar dependencias:
   ```bash
   pnpm install
   ```

2. Configurar variables de entorno:
   Copiar `.env.example` a `.env` y ajustar valores.

3. Correr en desarrollo:
   ```bash
   pnpm start:dev
   ```

4. Construir para producción:
   ```bash
   pnpm build
   ```

## 📡 Endpoints Principales

- `GET /doctor-profile`: Perfil público de la doctora.
- `POST /auth/register`: Registro de pacientes.
- `POST /appointments`: Agendamiento de citas.
- `GET /availability`: Consulta de fechas disponibles.

## 🐳 Docker

```bash
docker build -t system-date-backend .
docker compose up -d
```
