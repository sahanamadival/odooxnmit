import api from "./api";

export const manufacturingAPI = {
  // Get all manufacturing orders
  getManufacturingOrders: async (filters = {}) => {
    try {
      const response = await api.get("/manufacturing", { params: filters });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching manufacturing orders:", error);
      return [];
    }
  },

  // Get manufacturing order by ID
  getManufacturingOrder: async (id) => {
    try {
      const response = await api.get(`/manufacturing/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching manufacturing order:", error);
      return null;
    }
  },

  // Create new manufacturing order
  createManufacturingOrder: async (orderData) => {
    try {
      const response = await api.post("/manufacturing", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating manufacturing order:", error);
      throw error;
    }
  },

  // Update manufacturing order
  updateManufacturingOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/manufacturing/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error("Error updating manufacturing order:", error);
      throw error;
    }
  },

  // Delete manufacturing order
  deleteManufacturingOrder: async (id) => {
    try {
      const response = await api.delete(`/manufacturing/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting manufacturing order:", error);
      throw error;
    }
  },

  // Get work orders linked to a manufacturing order
  getWorkOrders: async (manufacturingOrderId) => {
    try {
      const response = await api.get("/workorders", {
        params: { manufacturingOrderId },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching work orders:", error);
      return [];
    }
  },

  // Dashboard summary
  getDashboardData: async () => {
    try {
      const [manufacturingResponse, workOrdersResponse] = await Promise.all([
        api.get("/manufacturing"),
        api.get("/workorders"),
      ]);

      return {
        manufacturingOrders: manufacturingResponse.data || [],
        workOrders: workOrdersResponse.data || [],
        summary: {
          totalOrders: manufacturingResponse.data?.length || 0,
          activeOrders:
            manufacturingResponse.data?.filter((o) => o.status === "pending")
              .length || 0,
          completedOrders:
            manufacturingResponse.data?.filter((o) => o.status === "completed")
              .length || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        manufacturingOrders: [],
        workOrders: [],
        summary: {
          totalOrders: 0,
          activeOrders: 0,
          completedOrders: 0,
        },
      };
    }
  },
};
