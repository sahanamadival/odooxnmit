import api from './api';

export const manufacturingAPI = {
  // Get all manufacturing orders
  getManufacturingOrders: async (filters = {}) => {
    try {
      const response = await api.get('/manufacturing-orders', { params: filters });
      return response.data || [];
    } catch (error) {
      // Return mock data for demo
      return [
        { id: 1, orderId: 'MO-001', product: 'Product 1', quantity: 100, startDate: '2024-01-15', endDate: '2024-01-20', status: 'New', progress: 0, goalDate: '2024-01-20' },
        { id: 2, orderId: 'MO-002', product: 'Product 2', quantity: 50, startDate: '2024-01-16', endDate: '2024-01-22', status: 'In Progress', progress: 45, goalDate: '2024-01-22' },
        { id: 3, orderId: 'MO-003', product: 'Product 3', quantity: 75, startDate: '2024-01-10', endDate: '2024-01-18', status: 'Completed', progress: 100, goalDate: '2024-01-18' },
        { id: 4, orderId: 'MO-004', product: 'Product 4', quantity: 200, startDate: '2024-01-20', endDate: '2024-01-25', status: 'Cancelled', progress: 0, goalDate: '2024-01-25' }
      ];
    }
  },

  // Get manufacturing order by ID
  getManufacturingOrder: async (id) => {
    try {
      const response = await api.get(`/manufacturing-orders/${id}`);
      return response.data;
    } catch (error) {
      return { id, orderId: `MO-${id}`, product: 'Sample Product', quantity: 100, status: 'New' };
    }
  },

  // Create new manufacturing order
  createManufacturingOrder: async (orderData) => {
    try {
      const response = await api.post('/manufacturing-orders', orderData);
      return response.data;
    } catch (error) {
      return { ...orderData, id: Date.now(), orderId: `MO-${Date.now()}` };
    }
  },

  // Update manufacturing order
  updateManufacturingOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/manufacturing-orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      return { ...orderData, id };
    }
  },

  // Confirm manufacturing order
  confirmManufacturingOrder: async (id) => {
    try {
      const response = await api.post(`/manufacturing-orders/${id}/confirm`);
      return response.data;
    } catch (error) {
      return { id, status: 'Confirmed' };
    }
  },

  // Start manufacturing order
  startManufacturingOrder: async (id) => {
    try {
      const response = await api.post(`/manufacturing-orders/${id}/start`);
      return response.data;
    } catch (error) {
      return { id, status: 'In Progress' };
    }
  },

  // Cancel manufacturing order
  cancelManufacturingOrder: async (id) => {
    try {
      const response = await api.post(`/manufacturing-orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      return { id, status: 'Cancelled' };
    }
  },

  // Get work orders for manufacturing order
  getWorkOrders: async (manufacturingOrderId) => {
    try {
      const response = await api.get(`/manufacturing-orders/${manufacturingOrderId}/work-orders`);
      return response.data || [];
    } catch (error) {
      return [];
    }
  },

  // Get dashboard data
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      return {
        manufacturingOrders: [
          { id: 1, orderId: 'MO-001', product: 'Product 1', quantity: 100, startDate: '2024-01-15', endDate: '2024-01-20', status: 'In Progress' },
          { id: 2, orderId: 'MO-002', product: 'Product 2', quantity: 50, startDate: '2024-01-16', endDate: '2024-01-22', status: 'Pending' },
          { id: 3, orderId: 'MO-003', product: 'Product 3', quantity: 75, startDate: '2024-01-10', endDate: '2024-01-18', status: 'Completed' }
        ],
        workOrders: [
          { id: 1, operation: 'Work Order 1', workCenter: 'Work Center 1', product: 'Product 1', quantity: 3, expectedDuration: 180, realDuration: 0, status: 'In Time' },
          { id: 2, operation: 'Work Order 2', workCenter: 'Work Center 2', product: 'Product 2', quantity: 2, expectedDuration: 120, realDuration: 0, status: 'In Time' }
        ],
        summary: {
          totalOrders: 3,
          activeOrders: 2,
          completedOrders: 1,
          totalValue: 15000
        }
      };
    }
  }
};
