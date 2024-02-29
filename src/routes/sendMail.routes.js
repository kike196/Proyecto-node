import express from "express";
import { createUser } from "../Controllers/sendMailController.js";

const router = express.Router();

router.post('/send-email', createUser);

export default router;