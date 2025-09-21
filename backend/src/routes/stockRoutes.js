// src/routes/stockRoutes.js
import { Router } from "express";
import {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock
} from "../controllers/stockController.js";

const router = Router();

// CRUD endpoints for Stock
router.post("/", createStock);
router.get("/", getAllStocks);
router.get("/:id", getStockById);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

export default router;
