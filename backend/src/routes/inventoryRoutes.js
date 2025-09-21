import express from 'express';
import {
  getAllInventoryLogs,
  getInventoryLogsByProduct,
  createInventoryLog,
  getInventorySummary
} from '../controllers/inventoryController.js';

const router = express.Router();

// Inventory log routes
router.get('/', getAllInventoryLogs);
router.get('/summary', getInventorySummary);
router.get('/product/:productId', getInventoryLogsByProduct);
router.post('/', createInventoryLog);

export default router;