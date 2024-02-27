import nodemailer from "nodemailer";

/**
 * Función para enviar correo electrónico utilizando Nodemailer.
 * 
 * @param {string} name - Nombre del remitente.
 * @param {string} email - Dirección de correo electrónico del remitente.
 * @param {string} phone - Número de teléfono del remitente.
 * @param {string} message - Mensaje del remitente.
 * @returns {Promise<string>} - Promesa que se resuelve con la respuesta del servidor SMTP después de enviar el correo electrónico.
 * @throws {Error} - Error que se produce si hay algún problema durante el envío del correo electrónico.
 */
export async function sendEmail(name, email, phone, message) {

  // Crear un transportador de nodemailer
  let transporter = nodemailer.createTransport({
    // Utilizar el servicio de Gmail para el envío de correos electrónicos
    // Nodemailer configurará automáticamente los parámetros correspondientes (host, puerto, seguridad, etc.) para Gmail.
    service: 'Gmail',
    // Autenticación utilizando las credenciales de Gmail
    auth: {
      user: process.env.EMAIL_USER, // Correo electrónico del remitente
      pass: process.env.EMAIL_PASSWORD // Contraseña del remitente (se recomienda almacenar en un lugar seguro y no incluir directamente en el código)
    },
    authMethod: 'PLAIN' // Método de autenticación explícitamente especificado como 'PLAIN'
  });

  // Opciones del correo electrónico a enviar
  let mailOptions = {
    from: "'ProyectoNodejs serve' <process.env.EMAIL_USER>", // Dirección y nombre del remitente
    to: process.env.EMAIL_USER, // Dirección de correo electrónico del destinatario
    subject: 'Website contact form', // Asunto del correo electrónico
    // Cuerpo del correo electrónico en formato HTML
    html: `
      <h1>User information</h1>
      <ul>
          <li>User name: ${name}</li>
          <li>User email: ${email}</li>
          <li>Phone: ${phone}</li>
      </ul>
      <p>${message}</p>
    `
  };

  try {
    // Enviar el correo electrónico utilizando el transportador de nodemailer
    let info = await transporter.sendMail(mailOptions);
    // Registrar la respuesta del servidor SMTP en la consola
    console.log('Correo enviado:', info.response);
    // Devolver la respuesta del servidor SMTP
    return info.response;
  } catch (error) {
    // Manejar cualquier error que ocurra durante el envío del correo electrónico
    console.error('Error al enviar el correo:', error);
    // Relanzar el error para que pueda ser manejado por el código que llama a esta función
    throw error;
  }
}
