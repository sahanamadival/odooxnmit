import api from './api';

export const workOrderAPI = {
  // Get all work orders
  getWorkOrders: async (filters = {}) => {
    try {
      const response = await api.get('/work-orders', { params: filters });
      return response.data || [];
    } catch (error) {
      return [
        { id: 1, operation: 'Work Order 1', workCenter: 'Work Center 1', finishedProduct: 'Product 1', expectedDuration: 180, realDuration: 0, status: 'In Time' },
        { id: 2, operation: 'Work Order 2', workCenter: 'Work Center 2', finishedProduct: 'Product 2', expectedDuration: 120, realDuration: 0, status: 'In Time' },
        { id: 3, operation: 'Work Order 3', workCenter: 'Work Center 3', finishedProduct: 'Product 3', expectedDuration: 240, realDuration: 180, status: 'In Time' },
        { id: 4, operation: 'Work Order 4', workCenter: 'Work Center 1', finishedProduct: 'Product 4', expectedDuration: 200, realDuration: 220, status: 'Delayed' }
      ];
    }
  },

  // Get work order by ID
  getWorkOrder: async (id) => {
    const response = await api.get(`/work-orders/${id}`);
    return response.data;
  },

  // Create new work order
  createWorkOrder: async (workOrderData) => {
    const response = await api.post('/work-orders', workOrderData);
    return response.data;
  },

  // Update work order
  updateWorkOrder: async (id, workOrderData) => {
    const response = await api.put(`/work-orders/${id}`, workOrderData);
    return response.data;
  },

  // Start work order
  startWorkOrder: async (id) => {
    const response = await api.post(`/work-orders/${id}/start`);
    return response.data;
  },

  // Complete work order
  completeWorkOrder: async (id) => {
    const response = await api.post(`/work-orders/${id}/complete`);
    return response.data;
  },

  // Get work order analysis
  getWorkOrderAnalysis: async (filters = {}) => {
    const response = await api.get('/work-orders/analysis', { params: filters });
    return response.data;
  }
};
