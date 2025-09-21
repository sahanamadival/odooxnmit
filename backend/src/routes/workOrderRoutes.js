// src/routes/workOrderRoutes.js
import { Router } from "express";
import {
  createWorkOrder,
  getAllWorkOrders,
  getWorkOrderById,
  updateWorkOrder,
  deleteWorkOrder
} from "../controllers/workOrderController.js";

const router = Router();

// CRUD endpoints for Work Orders
router.post("/", createWorkOrder);
router.get("/", getAllWorkOrders);
router.get("/:id", getWorkOrderById);
router.put("/:id", updateWorkOrder);
router.delete("/:id", deleteWorkOrder);

export default router;
