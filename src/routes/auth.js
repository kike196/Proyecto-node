import express from 'express';
const router = express.Router();

import * as authController from '../Controllers/authController.js';

//router para las vistas
router.get('/dashboard', authController.isAuthenticated, (req, res) => {    
    res.render('dashboard', {user:req.user, title: `Dashboard ${req.user.name}` });
});
router.get('/login', (req, res) => {
    res.render('login', {alert:false});
});
router.get('/register', (req, res) => {
    res.render('register');
});


router.get('/check-authentication', authController.isLogged, (req, res) => {
    // Si req.user está definido, significa que el usuario está autenticado
    if (req.user) {
      res.status(200).send('Usuario autenticado');
    } else {
      res.status(401).send('Usuario no autenticado');
    }
});

//router para los métodos del controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

export default router;
