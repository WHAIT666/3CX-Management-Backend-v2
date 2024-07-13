import express from 'express';
import {
  createSessionHandler,
  refreshAccessTokenHandler,
  logoutHandler
} from "../controller/auth.controller";
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schema/auth.schema';

const router = express.Router();

router.post("/api/auth/login", validateResource(createSessionSchema), createSessionHandler);
router.post("/api/auth/refresh-token", refreshAccessTokenHandler);
router.post("/api/auth/logout", logoutHandler);

export default router;
