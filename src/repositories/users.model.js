import { pool } from "./dbConnection.js";

export const getUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users ORDER BY id");
  return rows;
};

export const getUser = async (id) => {
  const sql = `SELECT * FROM users WHERE id=` + pool.escape(id);
  const [result] = await pool.query(sql);
  return result;
};

export const insertUser = async (userData) => {
  const [result] = await pool.query("INSERT INTO users SET ?", userData);
  return {
    ...userData,
    id: result.insertId,
  };
};

export const updateUser = async (userData) => {
  const sql = `
      UPDATE users SET
      name = ${pool.escape(userData.name)},
      phone = ${pool.escape(userData.phone)},
      email = ${pool.escape(userData.email)}
      WHERE id = ${userData.id}`;

  const [result] = await pool.query(sql);
  return result;
};

export const updateUserPath = async (userData) => {
  const sql = `
      UPDATE users SET
      name = IFNULL(${pool.escape(userData.name)}, name),
      user = IFNULL(${pool.escape(userData.user)}, user),
      phone = IFNULL(${pool.escape(userData.phone)}, phone),
      email = IFNULL(${pool.escape(userData.email)}, email),
      rol = IFNULL(${pool.escape(userData.rol)}, rol)
      WHERE id = ${pool.escape(userData.id)}`;

  const [result] = await pool.query(sql);
  return result;
};

export const deleteUser = async (id) => {
  const sql = `DELETE FROM users WHERE id=` + pool.escape(id);
  const [result] = await pool.query(sql);
  return result;
};
