import api from './api';

// Order API endpoints
export const orderAPI = {
  // Get all orders
  getAllOrders: () => api.get('/orders'),
  
  // Get order by ID
  getOrderById: (id) => api.get(`/orders/${id}`),
  
  // Get orders by customer
  getOrdersByCustomer: (customerId) => api.get(`/orders/customer/${customerId}`),
  
  // Create new order
  createOrder: (orderData) => api.post('/orders', orderData),
  
  // Update order status
  updateOrderStatus: (id, statusData) => api.patch(`/orders/${id}/status`, statusData),
  
  // Delete order
  deleteOrder: (id) => api.delete(`/orders/${id}`)
};

export default orderAPI;