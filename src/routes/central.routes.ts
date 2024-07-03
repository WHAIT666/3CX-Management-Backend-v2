import express from "express";
import {
  createCentralHandler,
  getCentralHandler,
  updateCentralHandler,
  deleteCentralHandler,
  getAllCentralsHandler,
} from "../controller/central.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createCentralSchema, updateCentralSchema } from "../schema/central.schema";
// Import the schema when ready

const router = express.Router();

router.post("/api/centrals", requireUser, validateResource(createCentralSchema), createCentralHandler);
router.get("/api/centrals", requireUser, getAllCentralsHandler);
router.get("/api/centrals/:id", requireUser, getCentralHandler);
router.put("/api/centrals/:id", requireUser, validateResource(updateCentralSchema), updateCentralHandler);
router.delete("/api/centrals/:id", requireUser, deleteCentralHandler);

export default router;
