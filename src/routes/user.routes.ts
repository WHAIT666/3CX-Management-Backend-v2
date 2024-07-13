// src/routes/user.routes.ts
import express from 'express';
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
  getAllUsersHandler
} from '../controller/user.controller';
import validateResource from '../middleware/validateResource';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from '../schema/user.schema';
import requireUser from '../middleware/requireUser';
import requireRole from '../middleware/requireRole';
import { Roles } from '../utils/roles';

const router = express.Router();

router.post("/api/users", validateResource(createUserSchema), createUserHandler);
router.post("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);
router.post("/api/users/forgotpassword", validateResource(forgotPasswordSchema), forgotPasswordHandler);
router.post("/api/users/resetpassword/:id/:passwordResetCode", validateResource(resetPasswordSchema), resetPasswordHandler);
router.get("/api/users/me", requireUser, getCurrentUserHandler);
router.get("/api/admin/users", requireUser, requireRole(Roles.Admin), getAllUsersHandler);

export default router;
