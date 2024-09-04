import express from "express";
import {
  createCentralHandler,
  getCentralHandler,
  updateCentralHandler,
  deleteCentralHandler,
  getAllCentralsHandler,
  getSystemStatusHandler,
  getExtensionsHandler,
  getAggregatedSystemStatusHandler, 
} from "../controllers/central.controller";
import validateResource from "../middlewares/validateResource";
import { createCentralSchema, updateCentralSchema } from "../schema/central.schema";
import { verifyToken } from "../middlewares/verifyToken";  // Import the verifyToken middleware

const router = express.Router();

// Protected routes: require the user to be authenticated
router.post("/centrals", verifyToken, validateResource(createCentralSchema), createCentralHandler);
router.get("/centrals", verifyToken, getAllCentralsHandler);
router.get("/centrals/:id", verifyToken, getCentralHandler);
router.put("/centrals/:id", verifyToken, validateResource(updateCentralSchema), updateCentralHandler);
router.delete("/centrals/:id", verifyToken, deleteCentralHandler);

// System and extensions status routes
router.get("/systemstatus", verifyToken, getSystemStatusHandler); 
router.get("/systemextensions", verifyToken, getExtensionsHandler); 
router.get("/aggregatedsystemstatus", verifyToken, getAggregatedSystemStatusHandler); 

export default router;
