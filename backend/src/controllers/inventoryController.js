import { InventoryLog, Product } from '../models/index.js';

// Get all inventory logs
export const getAllInventoryLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku', 'stock']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching inventory logs:', error);
    res.status(500).json({ error: 'Failed to fetch inventory logs' });
  }
};

// Get inventory logs by product
export const getInventoryLogsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const logs = await InventoryLog.findAll({
      where: { product_id: productId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku', 'stock']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching product inventory logs:', error);
    res.status(500).json({ error: 'Failed to fetch product inventory logs' });
  }
};

// Create inventory log
export const createInventoryLog = async (req, res) => {
  try {
    const { product_id, change_qty, reason } = req.body;
    
    // Validate product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Create log
    const log = await InventoryLog.create({
      product_id,
      change_qty,
      reason
    });
    
    // Update product stock
    const newStock = product.stock + change_qty;
    if (newStock < 0) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    await product.update({ stock: newStock });
    
    // Fetch complete log data
    const completeLog = await InventoryLog.findByPk(log.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku', 'stock']
        }
      ]
    });
    
    res.status(201).json(completeLog);
  } catch (error) {
    console.error('Error creating inventory log:', error);
    res.status(500).json({ error: 'Failed to create inventory log' });
  }
};

// Get inventory summary
export const getInventorySummary = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'sku', 'stock', 'cost_price', 'selling_price'],
      include: [
        {
          model: InventoryLog,
          as: 'inventoryLogs',
          attributes: ['change_qty', 'reason', 'created_at'],
          limit: 5,
          order: [['created_at', 'DESC']]
        }
      ]
    });
    
    // Calculate inventory value
    let totalInventoryValue = 0;
    let lowStockProducts = [];
    
    products.forEach(product => {
      const inventoryValue = product.stock * product.cost_price;
      totalInventoryValue += inventoryValue;
      
      // Flag low stock products (less than 10 units)
      if (product.stock < 10) {
        lowStockProducts.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          stock: product.stock
        });
      }
    });
    
    res.json({
      totalProducts: products.length,
      totalInventoryValue,
      lowStockProducts,
      products
    });
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    res.status(500).json({ error: 'Failed to fetch inventory summary' });
  }
};