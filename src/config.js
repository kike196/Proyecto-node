import { config } from "dotenv";
config();

// Configuración del puerto para la aplicación Express
export const PORT = process.env.PORT || 3000;

// database environment variables
export const databaseUrl = process.env.DATABASE_URL;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASS = process.env.DB_PASS || "";
export const DB_DATABASE = process.env.DB_DATABASE || "ProyectoNode";
export const DB_PORT = process.env.DB_PORT || 3306;
