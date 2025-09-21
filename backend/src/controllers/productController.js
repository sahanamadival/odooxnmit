import { Product, InventoryLog } from '../models/index.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: InventoryLog, as: 'inventoryLogs' }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, sku, stock, cost_price, selling_price } = req.body;
    
    const product = await Product.create({
      name,
      sku,
      stock: stock || 0,
      cost_price,
      selling_price
    });
    
    // Log initial stock if provided
    if (stock > 0) {
      await InventoryLog.create({
        product_id: product.id,
        change_qty: stock,
        reason: 'Initial stock'
      });
    }
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, cost_price, selling_price } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await product.update({
      name,
      sku,
      cost_price,
      selling_price
    });
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
};

// Update product stock
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { change_qty, reason } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const newStock = product.stock + change_qty;
    if (newStock < 0) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    await product.update({ stock: newStock });
    
    // Log inventory change
    await InventoryLog.create({
      product_id: product.id,
      change_qty,
      reason: reason || 'Stock adjustment'
    });
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product stock:', error);
    res.status(500).json({ error: 'Failed to update product stock' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};