# 🚀 Proyecto Node.js Express Prisma - Starter Kit

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-blue?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-20.10-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)

> Plantilla base para aplicaciones backend con Node.js, Express y Prisma

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Scripts Disponibles](#-scripts-disponibles)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API y Endpoints](#-api-y-endpoints)
- [Variables de Entorno](#-variables-de-entorno)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🎯 Descripción del Proyecto

Este proyecto es un starter kit o plantilla base, diseñado para acelerar el desarrollo de aplicaciones backend modernas y escalables. Proporciona una base sólida con las mejores prácticas, integrando un stack tecnológico potente y un entorno de desarrollo completamente contenerizado con Docker.

La configuración incluye:
- Servidor Express.js con routing y middlewares
- ORM Prisma conectado a MySQL
- Sistema de autenticación JWT
- Renderizado de vistas con EJS
- Docker Compose para desarrollo y producción

## ✨ Características Principales

### 🚀 Backend Completo
- **Servidor Express.js** con routing y manejo de peticiones
- **ORM Prisma** para acceso a base de datos tipado
- **Base de Datos MySQL** para almacenamiento persistente
- **Renderizado del lado del servidor** con motor de plantillas EJS

### 🔐 Autenticación y Seguridad
- **JWT (JSON Web Tokens)** para autenticación segura
- **Bcrypt** para hashing de contraseñas
- **Middleware de autorización** para rutas protegidas
- **Integración con reCAPTCHA** para protección contra bots

### 🐳 Contenerización con Docker
- **Entorno de desarrollo aislado** con docker-compose
- **Hot Reloading** con nodemon
- **MySQL y phpMyAdmin** incluidos
- **Dockerfile optimizado** para producción

### 📦 Otras Características
- **Manejo de errores centralizado**
- **Validación de datos** con middlewares
- **Sistema de logging** con morgan y winston
- **Variables de entorno** con dotenv
- **Sistema de alertas y notificaciones** integrado

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js 20.x** - Entorno de ejecución JavaScript
- **Express 4.18** - Framework web para Node.js
- **Prisma 5.0** - ORM moderno para Node.js

### Base de Datos
- **MySQL 8.x** - Sistema de gestión de bases de datos relacional
- **Prisma Client** - Cliente de base de datos generado

### Frontend/Templates
- **EJS** - Motor de plantillas para renderizado del lado del servidor
- **HTML5/CSS3/JavaScript** - Tecnologías web estándar

### Desarrollo y Despliegue
- **Docker** - Contenerización de aplicaciones
- **Docker Compose** - Orquestación de contenedores
- **Nodemon** - Reinicio automático en desarrollo

## 📜 Scripts Disponibles

### Scripts de NPM
```bash
# Desarrollo con hot reload
npm run dev

# Iniciar en producción
npm start

# Ejecutar Prisma Studio (interfaz de base de datos)
npm run prisma:studio

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate
```

### Comandos de Prisma (útiles para manejo de BD)
```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Generar cliente Prisma
npx prisma generate

# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Ejecutar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos
npx prisma migrate reset
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Docker (opcional pero recomendado)
- MySQL (si no usas Docker)

### 1. Instalación Local
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/proyecto-node-express.git
cd proyecto-node-express

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

### 2. Instalación con Docker
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/proyecto-node-express.git
cd proyecto-node-express

# Iniciar servicios
docker-compose up -d

# Ejecutar migraciones
docker-compose exec app npx prisma migrate dev
```

## 📁 Estructura del Proyecto

```
proyecto-node/
├── prisma/
│   └── schema.prisma             # Esquema de la base de datos
├── src/
│   ├── controllers/              # Lógica de negocio
│   ├── middleware/               # Middlewares de Express
│   ├── routes/                   # Definición de rutas
│   ├── services/                 # Lógica de servicios
│   ├── repositories/             # Acceso a datos
│   ├── helpers/                  # Utilidades y helpers
│   ├── utils/                    # Utilidades adicionales
│   ├── validators/               # Validadores de datos
│   ├── views/                    # Plantillas EJS
│   ├── public/                   # Archivos estáticos
│   ├── app.js                    # Configuración de Express
│   └── index.js                  # Punto de entrada
├── .env.example                  # Variables de entorno ejemplo
├── docker-compose.yml            # Configuración Docker
└── package.json                  # Dependencias
```

## 🔌 API y Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil de usuario

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario

### Ejemplo de Respuesta (Login)
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "alert": {
    "type": "success",
    "title": "Bienvenido",
    "message": "Has iniciado sesión correctamente"
  }
}
```

## ⚙️ Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# Configuración de la aplicación
PORT=3000
NODE_ENV=development

# Base de datos
DATABASE_URL=mysql://usuario:password@localhost:3306/nombre_basedatos

# Autenticación JWT
JWT_SECRETO=tu_jwt_secreto_muy_seguro_y_largo
JWT_TIEMPO_EXPIRA=24h
JWT_COOKIE_EXPIRES=90

# reCAPTCHA
RECAPTCHA_SECRET_KEY=tu_clave_secreta_recaptcha
RECAPTCHA_SITE_KEY=tu_clave_sitio_recaptcha

# Otras configuraciones
SESSION_SECRET=tu_session_secret
FRONTEND_URL=http://localhost:3000
```

## 🐳 Docker

### Comandos Básicos
```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f app
```

### Estructura Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mysql://root:password@db:3306/appdb
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: appdb
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    ports:
      - "8080:80"
    environment:
      PMA_HOST: db
      MYSQL_ROOT_PASSWORD: password
    depends_on:
      - db

volumes:
  mysql_data:
```

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

*Última actualización: ${new Date().toLocaleDateString('es-ES')}*