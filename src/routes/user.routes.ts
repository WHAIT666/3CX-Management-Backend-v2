import express from "express";
import { createUserSchema } from "../schema/user.schema";
import validateResource from "../middleware/validateResource";
import { createUserHandler } from "../controller/user.controller";

const router = express.Router();

router.post("/api/users", validateResource(createUserSchema), createUserHandler);

export default router;