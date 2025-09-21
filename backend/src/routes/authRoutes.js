// src/routes/authRoutes.js
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

export default router;
