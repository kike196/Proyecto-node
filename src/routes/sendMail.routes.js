import express from "express";
import { sendEmail } from "../helpers/mailer.js";
import { createEmail } from "../Controllers/sendMailController.js";
import * as authController from '../Controllers/authController.js';
import {
    insertUser,
    getUser
} from "../repositories/users.model.js";

const router = express.Router();

router.post('/send-email', createEmail);

router.get("/create/email", authController.isAuthenticated, (req, res) => {
  res.render('create-email', { alert:false, title: 'Create Email' });
});
  
router.post("/create/email", authController.isAuthenticated, async (req, res) => {
    const { message } = req.body;
    const { name, email, phone } = req.user;
    const userData = { name, email, phone, message };
    try {
        await insertUser(userData);
        await sendEmail(name, email, phone, message);
        return res.status(200).render('create-email', {
            alert: true,
            alertTitle: "Enviado",
            alertMessage: "¡Correo enviado exitosamente!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'dashboard',
            title: 'dashboard',
            user:req.user
        });
        // return res.json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
});
  

export default router;