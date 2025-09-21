// src/routes/bomRoutes.js
import { Router } from "express";
import {
  createBOM,
  getAllBOMs,
  getBOMById,
  updateBOM,
  deleteBOM
} from "../controllers/bomController.js";

const router = Router();

// CRUD endpoints for BOM
router.post("/", createBOM);
router.get("/", getAllBOMs);
router.get("/:id", getBOMById);
router.put("/:id", updateBOM);
router.delete("/:id", deleteBOM);

export default router;
