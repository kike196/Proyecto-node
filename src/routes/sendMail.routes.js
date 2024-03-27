import express from "express";
import { sendEmail } from "../helpers/mailer.js";
import { createEmail } from "../Controllers/sendMailController.js";
import * as authController from '../Controllers/authController.js';
import * as message from "../repositories/message.model.js";

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
        await insertMessage(userData);
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
  
router.get('/messages', authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    try {
      const users = await message.getMessages();
      res.status(200).render('messages', {users:users, title: 'Messages'});
    } catch (error) {
      return res.status(500).json({
        message: 'Messages not found' 
      });
    };
  });
  
  router.get("/message/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const id = req.params.id;
    const user = await message.getMessage(id);
  
    try {
      res.render('message', {user:user[0], title: `User ${user[0].name}`} );
    } catch (error) {
       return res.status(500).json({
        message: 'Messages not found' 
      });
    }
  });
  
  router.put("/messages/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const userData = {
      id: req.params.id,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    };
    const result = await message.updateMessage(userData);
  
    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "user not found" });
  
    const id = req.params.id;
    const user = await message.getMessage(id);
  
    return res.status(200).json(user);
  });
  
  router.get("/message/edit/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const id = req.params.id;
    const user = await message.getMessage(id)
  
    try {
      res.render('editContacts', {user:user[0], title: `edit user ${user[0].name}`});
    } catch (error) {
       return res.status(500).json({
        message: 'Messages not found' 
      });
    }
  });
  
  router.post("/message/edit/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const userData = {
      id: req.params.id,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message
    };
    const result = await message.updateMessagePath(userData);
    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "user not found" });
  
    return res.status(200).redirect('/api/messages')
  });
  
  router.get("/message/delete/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const id = req.params.id;
    const result = await message.deleteMessage(id);
    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "user not found" });
  
    return res.status(200).redirect('/api/messages')
  });

export default router;