import express from "express";
import { sendEmail } from "../helpers/mailer.js";
import { createEmail } from "../Controllers/sendMailController.js";
import * as authController from '../Controllers/authController.js';
import * as messageModel from "../repositories/message.model.js";

const router = express.Router();

router.post('/send-email', createEmail);

router.get("/create/email", authController.isAuthenticated, (req, res) => {
  res.render('create-email', { alert:false, title: 'Create Email' });
});
  
router.post("/create/email", authController.isAuthenticated, async (req, res) => {
    const { message } = req.body;

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

    const { name, email, phone, created_at } = req.user;
    const userData = { id: newMessageId, name, email, phone, message, created_at };
    //console.log(userData);
    try {
        await messageModel.insertMessage(userData);
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
      const users = await messageModel.getMessages();
      res.status(200).render('messages', { alert:false, users:users, title: 'Messages'});
    } catch (error) {
      return res.status(500).json({
        message: 'Messages not found' 
      });
    };
  });
  
  router.get("/message/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const id = req.params.id;
    const user = await messageModel.getMessage(id);
  
    try {
      res.render('message', { alert:false, user:user, title: `User ${user.name}`} );
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
    const result = await messageModel.updateMessage(userData);
  
    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "user not found" });
  
    const id = req.params.id;
    const user = await messageModel.getMessage(id);
  
    return res.status(200).json(user);
  });
  
  router.get("/message/edit/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const id = req.params.id;
    const user = await messageModel.getMessage(id)
  
    try {
      res.render('editMessage', {user:user, title: `edit user ${user.name}`});
    } catch (error) {
       return res.status(500).json({
        message: 'Messages not found' 
      });
    }
  });
  
  router.post("/message/edit/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const users = await messageModel.getMessages();
    const userData = {
      id: req.params.id,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message
    };
    const result = await messageModel.updateMessagePath(userData);
    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "user not found" });
  
    return res.status(200).render('messages', 
    { alert: true,
      alertTitle: "Completado",
      alertMessage: "¡Usuario modificado exitosamente!",
      alertIcon: 'success',
      showConfirmButton: false,
      timer: 1500,
      ruta: 'messages',
      title: 'Messages',
      users:users
    });
  });
  
  router.get("/message/delete/:id", authController.isAuthenticated, authController.isAdmin, async (req, res) => {
    const id = req.params.id;
    const result = await messageModel.deleteMessage(id);
    console.log(id);
    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "user not found" });
  
    return res.status(200).redirect('/messages')
  });

export default router;