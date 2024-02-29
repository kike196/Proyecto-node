import { Router } from "express";
import {
  deleteUser,
  getUsers,
  insertUser,
  updateUser,
  getUser
} from "../models/users.model.js";

const router = Router();

router.get("/users", async (req, res) => {
  const users = await getUsers();
  res.status(200).json(users);
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id)
  if (user.affectedRows === 0) return res.status(404).json({ 
    msg: "user not found" 
  });

  return res.status(200).json(user);
});

router.post("/users", async (req, res) => {
  const { name, email} = req.body;
  const userData = {
    name,
    email,
  };
  try {
    const result = await insertUser(userData);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
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

  return res.json(result);
});

router.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteUser(id)
  if (result.affectedRows === 0)
    return res.status(404).json({ msg: "user not found" });

  return res.sendStatus(204);
});

export default router;
