import app from "./app.js";
import { PORT } from "./config.js";


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
