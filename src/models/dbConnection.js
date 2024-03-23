import { createPool } from "mysql2/promise";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from "../config.js";

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

pool.getConnection()
  .then((connection) => {
    console.log('Conexión exitosa a la base de datos');
    // Si la conexión es exitosa, libera la conexión inmediatamente
    connection.release();
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error.message);
  });
