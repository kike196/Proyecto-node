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

export const deleteUser = async (id) => {
  const sql = `DELETE FROM users WHERE id=` + pool.escape(id);
  const [result] = await pool.query(sql);
  return result;
};
