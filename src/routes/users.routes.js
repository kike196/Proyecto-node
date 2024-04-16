import { Router } from "express";
import {
  deleteUser,
  getUsers,
  insertUser,
  updateUser,
  updateUserPath,
  getUser
} from "../repositories/users.model.js";

import * as authController from '../Controllers/authController.js';

const router = Router();

router.use(authController.isAuthenticated, authController.isAdmin);

router.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).render('users', { alert:false, users:users, title: 'Users'});
  } catch (error) {
    return res.status(500).json({
      message: 'Users not found' 
    });
  };
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id);

  try {
    res.render('user', { alert:false, user:user, title: `User ${user.name}`} );
  } catch (error) {
     return res.status(500).json({
      message: 'Users not found' 
    });
  }
});

router.put("/users/:id", async (req, res) => {
  const userData = {
    id: req.params.id,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  };
  const result = await updateUser(userData);

  if (result.affectedRows === 0)
    return res.status(404).json({ msg: "user not found" });

  const id = req.params.id;
  const user = await getUser(id);

  return res.status(200).json(user);
});

router.get("/user/edit/:id", async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id)

  try {
    res.render('editUsers', {user:user, title: `edit user ${user.name}`});
  } catch (error) {
     return res.status(500).json({
      message: 'Users not found' 
    });
  }
});

router.post("/user/edit/:id", async (req, res) => {
  const users = await getUsers();
  const userData = {
    id: req.params.id,
    name: req.body.name,
    user: req.body.user,
    phone: req.body.phone,
    email: req.body.email,
    rol: req.body.rol
  };
  const result = await updateUserPath(userData);
  if (result.affectedRows === 0)
    return res.status(404).json({ msg: "user not found" });

  return res.status(200).render('users', 
              { alert: true,
                alertTitle: "Completado",
                alertMessage: "¡Usuario modificado exitosamente!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'api/users',
                title: 'Users',
                users:users
              });
});

router.get("/user/delete/:id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteUser(id);
  if (result.affectedRows === 0)
    return res.status(404).json({ msg: "user not found" });

  return res.status(200).redirect('/api/users')
});

export default router;
