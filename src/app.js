// Importar módulos necesarios de Express y Node.js
import express, { json } from "express";
import morgan from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import './database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Crear una aplicación Express
const app = express();

// Crear una instancia de Prisma Client
const prisma = new PrismaClient();

// Configuración de las rutas y el motor de vistas
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware

//seteamos la carpeta public para archivos estáticos
app.use(express.static(join(__dirname, 'public')));

app.use(morgan('dev'));

// Middleware para analizar datos de formulario URL-encoded
app.use(express.urlencoded({ extended: true }));
// Este middleware permite analizar datos JSON enviados al servidor
app.use(express.json())

//para poder trabajar con las cookies
app.use(cookieParser())

// Importar las rutas definidas en el archivo index.js en el directorio routes
import indexRoutes from "./routes/index.js";
import UserRoutes from "./routes/users.routes.js";
import sendMailRoutes from "./routes/sendMail.routes.js";
import auth from "./routes/auth.js";

// Utilizar las rutas definidas en la carpeta routes
app.use(indexRoutes);
app.use('/api',UserRoutes);
app.use(sendMailRoutes);
app.use(auth);

//middleware de control de caché 
app.use((req, res, next) => {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    next();
});

// Agregar Prisma Client a las solicitudes
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.render('NotFoundPage', { title: 'Not found' })
});


export default app;