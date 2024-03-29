import { pool } from "./dbConnection.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const queriesFolderPath = join(__dirname, 'queries', 'users');

export const getUsers = async () => {
  const getUsersQuery = fs.readFileSync(path.join(queriesFolderPath, 'getUsers.sql'), 'utf-8');
  console.log('Contenido del archivo getUsers.sql:', getUsersQuery);
  const [rows] = await pool.query(getUsersQuery);
  return rows;
};


export const getUser = async (id) => {
  const getUserQuery = fs.readFileSync(path.join(queriesFolderPath, 'getUser.sql'), 'utf-8');
  const [result] = await pool.query(`${getUserQuery} WHERE id = ?`, [id]);
  return result;
};

export const insertUser = async (userData) => {
  const insertUserQuery = fs.readFileSync(path.join(queriesFolderPath, 'insertUser.sql'), 'utf-8');
  const [result] = await pool.query(insertUserQuery, [userData]);
  return {
    ...userData,
    id: result.insertId,
  };
};

export const updateUser = async (userData) => {
  const updateUserQuery = fs.readFileSync(path.join(queriesFolderPath, 'updateUser.sql'), 'utf-8');
  const { id, name, phone, email } = userData;
  const [result] = await pool.query(updateUserQuery, [name, phone, email, id]);
  return result;
};

export const updateUserPath = async (userData) => {
  const updateUserPathQuery = fs.readFileSync(path.join(queriesFolderPath, 'updateUserPath.sql'), 'utf-8');
  const { id, name, user, phone, email, rol } = userData;
  const [result] = await pool.query(updateUserPathQuery, [name, user, phone, email, rol, id]);
  return result;
};

export const deleteUser = async (id) => {
  const deleteUserQuery = fs.readFileSync(path.join(queriesFolderPath, 'deleteUser.sql'), 'utf-8');
  const [result] = await pool.query(deleteUserQuery, [id]);
  return result;
};
