// Importar módulos necesarios de Express y Node.js
import express, { json } from "express";
import morgan from "morgan";
import i18n from "i18n";
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

// Configuración de i18n
i18n.configure({
  locales: ['es', 'en'],
  directory: join(__dirname, 'locales'),
  defaultLocale: 'es',
  cookie: 'locale',
  queryParameter: 'lang',
  autoReload: true,
  syncFiles: true,
});

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

// PARA PODER TRABAJAR CON LAS COOKIES
app.use(cookieParser())

// INICIALIZAR I18N PRIMERO - esto es crucial
app.use(i18n.init);

// Middleware para hacer las funciones de i18n disponibles en las vistas
app.use((req, res, next) => {
  res.locals.__ = res.__;
  res.locals.getLocale = () => req.getLocale();
  res.locals.currentLocale = req.getLocale();
  next();
});

// Middleware para detectar el idioma basado en cookies o headers
app.use((req, res, next) => {
  // Primero verificar si hay un parámetro de query ?lang=
  if (req.query.lang && ['es', 'en'].includes(req.query.lang)) {
    req.setLocale(req.query.lang);
    res.cookie('locale', req.query.lang, { 
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true 
    });
  }
  // Si no, verificar si hay cookie de idioma
  else if (req.cookies.locale && ['es', 'en'].includes(req.cookies.locale)) {
    req.setLocale(req.cookies.locale);
  }
  // Si no hay cookie, detectar idioma del navegador
  else if (req.headers['accept-language']) {
    const browserLang = req.headers['accept-language'].split(',')[0].split('-')[0];
    if (['es', 'en'].includes(browserLang)) {
      req.setLocale(browserLang);
      res.cookie('locale', browserLang, { 
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true 
      });
    }
  }
  next();
});

// Importar las rutas
import indexRoutes from "./routes/index.js";
import UserRoutes from "./routes/users.routes.js";
import sendMailRoutes from "./routes/sendMail.routes.js";
import auth from "./routes/auth.js";

// Ruta para cambiar el idioma
app.get('/change-lang/:lang', (req, res) => {
  const { lang } = req.params;
  if (['es', 'en'].includes(lang)) {
    res.cookie('locale', lang, { 
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true 
    });
    req.setLocale(lang);
  }
  res.redirect('back');
});

// Utilizar las rutas definidas
app.use(indexRoutes);
app.use('/api', UserRoutes);
app.use(sendMailRoutes);
app.use(auth);

// Middleware de control de caché 
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
  res.render('NotFoundPage', { title: 'Not found' });
});

export default app;