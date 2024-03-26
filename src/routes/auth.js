import express from 'express';
const router = express.Router();

import * as authController from '../Controllers/authController.js';

//router para las vistas
router.get('/c-panel', authController.isAuthenticated, (req, res, next) => {
  if (req.user && (req.user.rol === 'Admin' || req.user.rol === 'admin')) {
    return res.render('c-panel', { alert:false, user:req.user, title: `C-panel ${req.user.name}` });
  } else {
   return res.redirect('/dashboard');
  }
});


router.get('/dashboard', authController.isAuthenticated, (req, res, next) => {
  if (req.user && (req.user.rol === 'Admin' || req.user.rol === 'admin')) {
    return res.render('c-panel', { alert:false, user:req.user, title: `C-panel ${req.user.name}` });
  } else {
    return res.render('dashboard', { alert:false, user:req.user, title: `Dashboard ${req.user.name}` });
  }
});

router.get('/login', authController.isLogged, (req, res) => {
    res.render('login', { alert:false, title: 'Login'});
});
router.get('/register', (req, res) => {
    res.render('register', { alert:false, title: 'Register'});
});

router.get('/check-authentication', authController.isLogged, (req, res) => {
  if (req.user) {
      res.status(200).json({ authenticated: true, role: req.user.rol });
  } else {
      res.status(401).json({ authenticated: false });
  }
});


//router para los métodos del controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

export default router;
