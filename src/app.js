// Importar módulos necesarios de Express y Node.js
import express, { json } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Crear una aplicación Express
const app = express();

// Middleware para analizar datos de formulario URL-encoded
// Este middleware permite analizar datos de formularios enviados desde un navegador web
// { extended: false } indica que solo se analizarán datos simples, sin objetos anidados o arreglos
app.use(express.urlencoded({ extended: false }));

// Middleware para analizar datos JSON
// Este middleware permite analizar datos JSON enviados al servidor
app.use(json());

// Importar las rutas definidas en el archivo index.js en el directorio routes
import indexRoutes from "./routes/index.js";
import UserRoutes from "./routes/users.routes.js";
import sendMailRoutes from "./routes/sendMail.routes.js";

// Configuración de las rutas y el motor de vistas
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Utilizar las rutas definidas en la carpeta routes
app.use(indexRoutes);
app.use('/api',UserRoutes);
app.use(sendMailRoutes);

// Middleware para servir archivos estáticos desde el directorio public
// Estos archivos están disponibles para el cliente sin necesidad de procesamiento adicional del servidor
app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
    res.status(404).json({
        message: 'endpoint no found'
    })
})

export default app;