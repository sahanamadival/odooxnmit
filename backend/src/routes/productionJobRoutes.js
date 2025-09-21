import express from 'express';
import {
  getAllProductionJobs,
  getProductionJobById,
  createProductionJob,
  updateProductionJobStatus,
  startProductionJob,
  completeProductionJob,
  deleteProductionJob
} from '../controllers/productionJobController.js';

const router = express.Router();

// Production job routes
router.get('/', getAllProductionJobs);
router.get('/:id', getProductionJobById);
router.post('/', createProductionJob);
router.patch('/:id/status', updateProductionJobStatus);
router.patch('/:id/start', startProductionJob);
router.patch('/:id/complete', completeProductionJob);
router.delete('/:id', deleteProductionJob);

export default router;