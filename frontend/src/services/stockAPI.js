import api from './api';

export const stockAPI = {
  // Get all stock items
  getStockItems: async (filters = {}) => {
    try {
      const response = await api.get('/stock', { params: filters });
      return response.data || [];
    } catch (error) {
      return [
        { id: 1, product: 'Product 1', unitCost: 25.50, unit: 'Pieces', totalValue: 2550, onHand: 100, freeToUse: 80, incoming: 20, outgoing: 0 },
        { id: 2, product: 'Product 2', unitCost: 15.75, unit: 'Pieces', totalValue: 1575, onHand: 100, freeToUse: 100, incoming: 0, outgoing: 0 },
        { id: 3, product: 'Product 3', unitCost: 45.00, unit: 'Pieces', totalValue: 4500, onHand: 100, freeToUse: 60, incoming: 40, outgoing: 0 },
        { id: 4, product: 'Product 4', unitCost: 12.25, unit: 'Pieces', totalValue: 1225, onHand: 100, freeToUse: 100, incoming: 0, outgoing: 0 }
      ];
    }
  },

  // Get stock item by ID
  getStockItem: async (id) => {
    const response = await api.get(`/stock/${id}`);
    return response.data;
  },

  // Create new stock item
  createStockItem: async (stockData) => {
    const response = await api.post('/stock', stockData);
    return response.data;
  },

  // Update stock item
  updateStockItem: async (id, stockData) => {
    const response = await api.put(`/stock/${id}`, stockData);
    return response.data;
  },

  // Get bills of materials
  getBillsOfMaterials: async (filters = {}) => {
    const response = await api.get('/bills-of-materials', { params: filters });
    return response.data;
  },

  // Get bill of materials by ID
  getBillOfMaterials: async (id) => {
    const response = await api.get(`/bills-of-materials/${id}`);
    return response.data;
  },

  // Create bill of materials
  createBillOfMaterials: async (bomData) => {
    const response = await api.post('/bills-of-materials', bomData);
    return response.data;
  },

  // Update bill of materials
  updateBillOfMaterials: async (id, bomData) => {
    const response = await api.put(`/bills-of-materials/${id}`, bomData);
    return response.data;
  },

  // Get work centers
  getWorkCenters: async (filters = {}) => {
    const response = await api.get('/work-centers', { params: filters });
    return response.data;
  },

  // Get work center by ID
  getWorkCenter: async (id) => {
    const response = await api.get(`/work-centers/${id}`);
    return response.data;
  },

  // Create work center
  createWorkCenter: async (workCenterData) => {
    const response = await api.post('/work-centers', workCenterData);
    return response.data;
  },

  // Update work center
  updateWorkCenter: async (id, workCenterData) => {
    const response = await api.put(`/work-centers/${id}`, workCenterData);
    return response.data;
  }
};
