import express from 'express';
import { signup, verifyEmail, login, logout, forgotPassword, resetPassword, checkAuth } from '../controllers/auth.controller';
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);

export default router;
