import { sendEmail } from "../helpers/mailer.js";
import {
    getUsers,
    insertUser,
} from "../models/users.model.js";

export const createUser = async (req, res) => {
    const { name, email, phone, message, 'g-recaptcha-response': grecaptcha } = req.body;
    const userData = {
        name,
        email,
        phone,
        message
    };
    // Obtener la lista de usuarios desde la base de datos
    const users = await getUsers();

    // Validar reCAPTCHA
    if (!grecaptcha) {
        return res.status(400).redirect('/contact?error=Por favor, complete el reCAPTCHA.');
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${grecaptcha}`, {
        method: 'POST'
    });
    const data = await response.json();

    if (!data.success) {
        return res.status(400).redirect('/contact?error=Error en la validación de reCAPTCHA.');
    }

    // Validar que todos los campos obligatorios estén presentes
    if (!name || !email || !phone || !message) {
        return res.status(400).redirect('/contact?error=Por favor, complete todos los campos obligatorios.');
    }

    // Validar el formato del correo electrónico con regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).redirect('/contact?error=Por favor, proporcione un correo electrónico válido.');
    }

    // Verificar si algún usuario ya tiene el correo electrónico proporcionado
    const emailAlreadyExists = users.some(user => user.email === email);
    if (emailAlreadyExists) {
        return res.status(400).redirect('/contact?error=Correo electrónico ya utilizado.');
    }
    
    // Si se proporciona un número de teléfono, validar su formato con regular expression
    if (phone) {
        const phoneRegex = /^(\+?\d{1,3}\s?)?((\(\d{2,5}\))|\d{2,5})[-.\s]?\d{2,5}[-.\s]?\d{2,5}[-.\s]?\d{2,5}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).redirect('/contact?error=Por favor, proporcione un número de teléfono válido.');
        }
    }

    // Verificar si algún usuario ya tiene el número de teléfono proporcionado
    const phoneAlreadyExists = users.some(user => user.phone === phone);
    if (phoneAlreadyExists) {
        return res.status(400).redirect('/contact?error=Número de teléfono ya utilizado.');
    }

    // Si todos los campos son válidos, enviar el correo electrónico
    try {
        await sendEmail(name, email, phone, message);
        await insertUser(userData);
        return res.status(200).redirect('/contact?success=true');
    } catch (error) {
        console.error('Error al enviar el correo o insertar usuario:', error);
        return res.status(500).json({ error: 'Hubo un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.' });
    }
}
