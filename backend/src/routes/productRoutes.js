import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Product routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/stock', updateProductStock);
router.delete('/:id', deleteProduct);

export default router;