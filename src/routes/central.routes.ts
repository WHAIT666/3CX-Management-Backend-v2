import express from "express";
import {
  createCentralHandler,
  getCentralHandler,
  updateCentralHandler,
  deleteCentralHandler,
  getAllCentralsHandler,
  getSystemStatusHandler,
  getExtensionsHandler,
} from "../controller/central.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import requireRole from "../middleware/requireRole";
import { createCentralSchema, updateCentralSchema } from "../schema/central.schema";
import { Roles } from "../utils/roles";

const router = express.Router();

router.post("/api/centrals", requireUser, requireRole(Roles.Admin), validateResource(createCentralSchema), createCentralHandler);
router.get("/api/centrals", requireUser, requireRole(Roles.Admin), getAllCentralsHandler);
router.get("/api/centrals/:id", requireUser, requireRole(Roles.Admin), getCentralHandler);
router.put("/api/centrals/:id", requireUser, requireRole(Roles.Admin), validateResource(updateCentralSchema), updateCentralHandler);
router.delete("/api/centrals/:id", requireUser, requireRole(Roles.Admin), deleteCentralHandler);
router.get("/api/systemstatus", requireUser, requireRole(Roles.Admin), getSystemStatusHandler);
router.get("/api/systemextensions", requireUser, requireRole(Roles.Admin), getExtensionsHandler);

export default router;
