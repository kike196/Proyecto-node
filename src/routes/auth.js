import express from 'express';
const router = express.Router();

import * as authController from '../Controllers/authController.js';

//router para las vistas
router.get('/dashboard', authController.isAuthenticated, (req, res) => {    
    res.render('dashboard', {user:req.user});
});
router.get('/login', (req, res) => {
    res.render('login', {alert:false});
});
router.get('/register', (req, res) => {
    res.render('register');
});


//router para los métodos del controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

export default router;
