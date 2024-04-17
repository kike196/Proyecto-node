import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../helpers/mailer.js';
import * as messageModel from "../repositories/message.model.js";

const prisma = new PrismaClient();

export const createEmail = async (req, res) => {
    const { name, email, phone, message, 'g-recaptcha-response': grecaptcha } = req.body;

    // Obtener el mensaje con el ID más alto
    const messages = await messageModel.getMessages();

    let maxMessagesId = 0;

    // Buscar el número máximo de ID entre los usuarios existentes
    messages.forEach(message => {
        if (message.id > maxMessagesId) {
            maxMessagesId = message.id;
        }
    });

    // Incrementar el número máximo en 1 para el nuevo usuario
    const newMessageId = maxMessagesId + 1;

    const userData = {
        id: newMessageId,
        name,
        email,
        phone,
        message,
        created_at: new Date() // Obtener la fecha y hora actual
    };
    
    // Obtener desde la base de datos la lista de usuarios que han mandado mensajes en contact 
    const users = await prisma.message.findMany();

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${grecaptcha}`, {
        method: 'POST'
    });
    const data = await response.json();

    // Validar que todos los campos obligatorios estén presentes
    if (!name || !email || !phone || !message) {
        return res.status(400).render('contact', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Todos los campos son obligatorios.",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'contact',
            title: 'contact'
        });
    }

    // Validar el formato del correo electrónico con regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).render('contact', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor, proporcione un correo electrónico válido.",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'contact',
            title: 'contact'
        });
    }

    // Verificar si algún usuario ya tiene el correo electrónico proporcionado
    const emailAlreadyExists = users.some(user => user.email === email);
    if (emailAlreadyExists) {
        return res.status(400).render('contact', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Ya se uso ese correo electrónico para enviar un mensaje. puede registrarse para enviar mensajes sin restricción.",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'contact',
            title: 'contact'
        });
    }
    
    // Si se proporciona un número de teléfono, validar su formato con regular expression
    if (phone) {
        const phoneRegex = /^(\+?\d{1,3}\s?)?((\(\d{2,5}\))|\d{2,5})[-.\s]?\d{2,5}[-.\s]?\d{2,5}[-.\s]?\d{2,5}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).render('contact', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Por favor, proporcione un número de teléfono válido.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'contact',
                title: 'contact'
            });
        }
    }

    // Verificar si algún usuario ya tiene el número de teléfono proporcionado
    const phoneAlreadyExists = users.some(user => user.phone === phone);
    if (phoneAlreadyExists) {
        return res.status(400).render('contact', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Ya se uso ese número de teléfono para enviar un mensaje, puede registrarse para enviar mensajes sin restricción.",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'contact',
            title: 'contact'
        });
    }

    // Validar reCAPTCHA
    if (!grecaptcha) {
        return res.status(400).render('contact', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor, complete el reCAPTCHA.",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'contact',
            title: 'contact'
        });
    }

    if (!data.success) {
        return res.status(400).render('contact', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error en la validación de reCAPTCHA.",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'contact',
            title: 'contact'
        });
    }

    // Si todos los campos son válidos, enviar el correo electrónico
    try {
        await prisma.message.create({
            data: userData
        });
        await sendEmail(name, email, phone, message);
        return res.status(200).render('contact', {
            alert: true,
            alertTitle: "Enviado",
            alertMessage: "¡Mensaje enviado correctamente!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 1500,
            ruta: 'contact',
            title: 'contact'
        });
    } catch (error) {
        console.error('Error al enviar el correo o insertar usuario:', error);
        return res.status(500).render('contact', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "¡Hubo un error al enviar el mensaje!",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'contact',
            title: 'contact'
        });
    }
};
