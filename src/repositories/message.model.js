import { pool } from "./dbConnection.js";

export const getMessages = async () => {
  const [rows] = await pool.query("SELECT * FROM messages ORDER BY id");
  return rows;
};

export const getMessage = async (id) => {
  const sql = `SELECT * FROM messages WHERE id=` + pool.escape(id);
  const [result] = await pool.query(sql);
  return result;
};

export const insertMessage = async (userData) => {
  try {
    const [result] = await pool.query("INSERT INTO messages SET ?", userData);
    return {
      ...userData,
      id: result.insertId,
    };
  } catch (error) {
    // Manejar el error de inserción de manera adecuada
    console.error("Error al insertar el mensaje:", error);
    throw error; // Relanzar el error para que el controlador lo maneje
  }
};


export const updateMessage = async (userData) => {
  const sql = `
      UPDATE messages SET
      name = ${pool.escape(userData.name)},
      phone = ${pool.escape(userData.phone)},
      email = ${pool.escape(userData.email)}
      WHERE id = ${userData.id}`;

  const [result] = await pool.query(sql);
  return result;
};

export const updateMessagePath = async (userData) => {
  const sql = `
      UPDATE messages SET
      name = IFNULL(${pool.escape(userData.name)}, name),
      phone = IFNULL(${pool.escape(userData.phone)}, phone),
      email = IFNULL(${pool.escape(userData.email)}, email),
      message = IFNULL(${pool.escape(userData.message)}, message)
      WHERE id = ${pool.escape(userData.id)}`;

  const [result] = await pool.query(sql);
  return result;
};

export const deleteMessage = async (id) => {
  const sql = `DELETE FROM messages WHERE id=` + pool.escape(id);
  const [result] = await pool.query(sql);
  return result;
};
