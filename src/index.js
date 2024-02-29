// Importar módulos necesarios de Express y Node.js
import express, { json } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { PORT } from "./config.js";

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
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Utilizar las rutas definidas en la carpeta routes
app.use(indexRoutes);
app.use('/api',UserRoutes);
app.use(sendMailRoutes);

// Middleware para servir archivos estáticos desde el directorio public
// Estos archivos están disponibles para el cliente sin necesidad de procesamiento adicional del servidor
app.use(express.static(join(__dirname, 'public')));


// Iniciar el servidor Express y escuchar en el puerto especificado
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
});

// Manejo de errores
server.on('error', (error) => {
    console.error('Error starting server:', error);
});

// Cerrar el servidor adecuadamente cuando se recibe una señal de terminación (por ejemplo, CTRL + C)
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
