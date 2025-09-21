import api from './api';

// Product API endpoints
export const productAPI = {
  // Get all products
  getAllProducts: () => api.get('/products'),
  
  // Get product by ID
  getProductById: (id) => api.get(`/products/${id}`),
  
  // Create new product
  createProduct: (productData) => api.post('/products', productData),
  
  // Update product
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Update product stock
  updateProductStock: (id, stockData) => api.patch(`/products/${id}/stock`, stockData),
  
  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

export default productAPI;