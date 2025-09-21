import api from './api';

// Inventory API endpoints
export const inventoryAPI = {
  // Get all inventory logs
  getAllInventoryLogs: () => api.get('/inventory'),
  
  // Get inventory logs by product
  getInventoryLogsByProduct: (productId) => api.get(`/inventory/product/${productId}`),
  
  // Get inventory summary
  getInventorySummary: () => api.get('/inventory/summary'),
  
  // Create inventory log
  createInventoryLog: (logData) => api.post('/inventory', logData)
};

export default inventoryAPI;