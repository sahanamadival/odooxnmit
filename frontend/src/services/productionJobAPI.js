import api from './api';

// Production Job API endpoints
export const productionJobAPI = {
  // Get all production jobs
  getAllProductionJobs: () => api.get('/production-jobs'),
  
  // Get production job by ID
  getProductionJobById: (id) => api.get(`/production-jobs/${id}`),
  
  // Create new production job
  createProductionJob: (jobData) => api.post('/production-jobs', jobData),
  
  // Update production job status
  updateProductionJobStatus: (id, statusData) => api.patch(`/production-jobs/${id}/status`, statusData),
  
  // Start production job
  startProductionJob: (id) => api.patch(`/production-jobs/${id}/start`),
  
  // Complete production job
  completeProductionJob: (id) => api.patch(`/production-jobs/${id}/complete`),
  
  // Delete production job
  deleteProductionJob: (id) => api.delete(`/production-jobs/${id}`)
};

export default productionJobAPI;