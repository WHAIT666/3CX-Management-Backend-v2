import express from 'express';
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
  getAllUsersHandler,
  getUsersFrom3CXHandler,
  delete3CXUserHandler,
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
router.get("/api/users/3cx", requireUser, requireRole(Roles.Admin), getUsersFrom3CXHandler);
router.delete("/api/users/3cx/:id", requireUser, requireRole(Roles.Admin), delete3CXUserHandler);

export default router;
