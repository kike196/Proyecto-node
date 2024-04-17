import { Router } from "express";
import bcryptjs from 'bcryptjs';
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
    res.render('editUsers', { alert: false, user:user, title: `edit user ${user.name}`});
  } catch (error) {
     return res.status(500).json({
      message: 'Users not found' 
    });
  }
});

router.post("/user/edit/:id", async (req, res) => {
  const users = await getUsers();
  const id = req.params.id;
  const { name, user, email, phone, pass, confirmPass, rol } = req.body;
  
  if (pass !== confirmPass) {
    return res.status(400).render('editUsers', {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Las contraseñas no coinciden",
        alertIcon: 'info',
        showConfirmButton: true,
        timer: false,
        ruta: `api/user/edit/${id}`,
        title: `edit user ${name}`,
        user:user
    });
  }
  
  try {
    
    const passHash = await bcryptjs.hash(pass, 8);

    // Verificar si se proporcionó una nueva contraseña
    let userData;
    if (pass) {
      const passHash = await bcryptjs.hash(pass, 8);
      userData = { id: id, user, name, email, phone, pass: passHash, rol };
    } else {
      userData = { id: id, user, name, email, phone, rol };
    }

    const result = await updateUserPath(userData);
    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "user not found" });

    const existingUser = await getUser(id)
    console.log(existingUser);
    console.log("password = ", await bcryptjs.compare(pass, existingUser.pass));
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

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).render('error', {
      alert: true,
      alertTitle: "Error",
      alertMessage: "Hubo un error al actualizar el usuario.",
      alertIcon: 'error',
      showConfirmButton: true,
      timer: false,
      ruta: 'api/users',
      title: 'Error',
      users:users
    });
  }

});

router.get("/user/delete/:id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteUser(id);
  if (result.affectedRows === 0)
    return res.status(404).json({ msg: "user not found" });

  return res.status(200).redirect('/api/users')
});

export default router;
