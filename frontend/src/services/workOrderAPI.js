import api from "./api";

export const workOrderAPI = {
  // Get all work orders
  getWorkOrders: async (filters = {}) => {
    try {
      const response = await api.get("/workorders", { params: filters });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching work orders:", error);
      return [];
    }
  },

  // Get work order by ID
  getWorkOrder: async (id) => {
    try {
      const response = await api.get(`/workorders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching work order:", error);
      return null;
    }
  },

  // Create work order
  createWorkOrder: async (workOrderData) => {
    try {
      const response = await api.post("/workorders", workOrderData);
      return response.data;
    } catch (error) {
      console.error("Error creating work order:", error);
      throw error;
    }
  },

  // Update work order
  updateWorkOrder: async (id, workOrderData) => {
    try {
      const response = await api.put(`/workorders/${id}`, workOrderData);
      return response.data;
    } catch (error) {
      console.error("Error updating work order:", error);
      throw error;
    }
  },

  // Delete work order
  deleteWorkOrder: async (id) => {
    try {
      const response = await api.delete(`/workorders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting work order:", error);
      throw error;
    }
  },

  // Work order analysis
  getWorkOrderAnalysis: async (filters = {}) => {
    try {
      const response = await api.get("/workorders/analysis", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching work order analysis:", error);
      return {
        totalWorkOrders: 0,
        completedWorkOrders: 0,
        delayedWorkOrders: 0,
        averageDelay: 0,
      };
    }
  },
};
