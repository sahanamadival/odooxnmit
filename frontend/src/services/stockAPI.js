import api from "./api";

export const stockAPI = {
  // Get all stock items
  getStockItems: async (filters = {}) => {
    try {
      const response = await api.get("/stock", { params: filters });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching stock items:", error);
      return [];
    }
  },

  // Get stock item by ID
  getStockItem: async (id) => {
    try {
      const response = await api.get(`/stock/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching stock item:", error);
      return null;
    }
  },

  // Create new stock item
  createStockItem: async (stockData) => {
    try {
      const response = await api.post("/stock", stockData);
      return response.data;
    } catch (error) {
      console.error("Error creating stock item:", error);
      throw error;
    }
  },

  // Update stock item
  updateStockItem: async (id, stockData) => {
    try {
      const response = await api.put(`/stock/${id}`, stockData);
      return response.data;
    } catch (error) {
      console.error("Error updating stock item:", error);
      throw error;
    }
  },

  // Delete stock item
  deleteStockItem: async (id) => {
    try {
      const response = await api.delete(`/stock/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting stock item:", error);
      throw error;
    }
  },

  // Get BOM list
  getBillsOfMaterials: async (filters = {}) => {
    try {
      const response = await api.get("/bom", { params: filters });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching BOMs:", error);
      return [];
    }
  },

  // Get BOM by ID
  getBillOfMaterials: async (id) => {
    try {
      const response = await api.get(`/bom/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching BOM:", error);
      return null;
    }
  },

  // Create BOM
  createBillOfMaterials: async (bomData) => {
    try {
      const response = await api.post("/bom", bomData);
      return response.data;
    } catch (error) {
      console.error("Error creating BOM:", error);
      throw error;
    }
  },

  // Update BOM
  updateBillOfMaterials: async (id, bomData) => {
    try {
      const response = await api.put(`/bom/${id}`, bomData);
      return response.data;
    } catch (error) {
      console.error("Error updating BOM:", error);
      throw error;
    }
  },

  // Delete BOM
  deleteBillOfMaterials: async (id) => {
    try {
      const response = await api.delete(`/bom/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting BOM:", error);
      throw error;
    }
  },
};
