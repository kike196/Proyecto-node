import express from "express";
import { sendEmail } from "../helpers/mailer.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: 'My first web with Node,js'});
});

router.get('/about', (req, res) => {
    res.render('about', {title: 'About me'});
});

router.get('/contact', (req, res) => {
    res.render('contact', {title: 'Contact page'});
});

router.post('/send-email', async (req, res) => {
    const { name, email, phone, message, 'g-recaptcha-response': grecaptcha } = req.body;

    // Validar reCAPTCHA
    if (!grecaptcha) {
        return res.status(400).send('Por favor, complete el reCAPTCHA.');
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${grecaptcha}`, {
        method: 'POST'
    });
    const data = await response.json();

    if (!data.success) {
        return res.status(400).send('Error en la validación de reCAPTCHA.');
    }

    // Validar que todos los campos obligatorios estén presentes
    if (!name || !email || !message) {
        return res.status(400).send('Por favor, complete todos los campos obligatorios.');
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Por favor, proporcione un correo electrónico válido.');
    }

  // Si se proporciona un número de teléfono, validar su formato
    if (phone) {
        const phoneRegex = /^(\+\d{1,3}\s?)?((\(\d{3}\))|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).send('Por favor, proporcione un número de teléfono válido.');
        }
    }


    // Si todos los campos son válidos, enviar el correo electrónico
    try {
        await sendEmail(name, email, phone, message);
        res.send('Correo enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
});

export default router;
