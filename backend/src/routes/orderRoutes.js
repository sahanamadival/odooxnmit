import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByCustomer
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/customer/:customerId', getOrdersByCustomer);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;