import { ProductionJob, Order, Product, User, OrderItem } from '../models/index.js';

// Get all production jobs
export const getAllProductionJobs = async (req, res) => {
  try {
    const jobs = await ProductionJob.findAll({
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: User,
              as: 'customer',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku']
        }
      ],
      order: [['id', 'DESC']]
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching production jobs:', error);
    res.status(500).json({ error: 'Failed to fetch production jobs' });
  }
};

// Get production job by ID
export const getProductionJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await ProductionJob.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: User,
              as: 'customer',
              attributes: ['id', 'name', 'email']
            },
            {
              model: OrderItem,
              as: 'orderItems',
              include: [
                {
                  model: Product,
                  as: 'product'
                }
              ]
            }
          ]
        },
        {
          model: Product,
          as: 'product'
        }
      ]
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Production job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching production job:', error);
    res.status(500).json({ error: 'Failed to fetch production job' });
  }
};

// Create production job
export const createProductionJob = async (req, res) => {
  try {
    const { order_id, product_id, qty } = req.body;
    
    // Validate order and product exist
    const order = await Order.findByPk(order_id);
    const product = await Product.findByPk(product_id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const job = await ProductionJob.create({
      order_id,
      product_id,
      qty,
      status: 'PENDING'
    });
    
    const completeJob = await ProductionJob.findByPk(job.id, {
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: User,
              as: 'customer',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: Product,
          as: 'product'
        }
      ]
    });
    
    res.status(201).json(completeJob);
  } catch (error) {
    console.error('Error creating production job:', error);
    res.status(500).json({ error: 'Failed to create production job' });
  }
};

// Update production job status
export const updateProductionJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const job = await ProductionJob.findByPk(id);
    if (!job) {
      return res.status(404).json({ error: 'Production job not found' });
    }
    
    const updateData = { status };
    
    // Set timestamps based on status
    if (status === 'RUNNING' && !job.started_at) {
      updateData.started_at = new Date();
    } else if ((status === 'COMPLETED' || status === 'FAILED') && !job.finished_at) {
      updateData.finished_at = new Date();
    }
    
    await job.update(updateData);
    
    res.json(job);
  } catch (error) {
    console.error('Error updating production job status:', error);
    res.status(500).json({ error: 'Failed to update production job status' });
  }
};

// Start production job
export const startProductionJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await ProductionJob.findByPk(id);
    if (!job) {
      return res.status(404).json({ error: 'Production job not found' });
    }
    
    if (job.status !== 'PENDING') {
      return res.status(400).json({ error: 'Job is not in pending status' });
    }
    
    await job.update({
      status: 'RUNNING',
      started_at: new Date()
    });
    
    res.json(job);
  } catch (error) {
    console.error('Error starting production job:', error);
    res.status(500).json({ error: 'Failed to start production job' });
  }
};

// Complete production job
export const completeProductionJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await ProductionJob.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product'
        }
      ]
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Production job not found' });
    }
    
    if (job.status !== 'RUNNING') {
      return res.status(400).json({ error: 'Job is not in running status' });
    }
    
    // Update job status
    await job.update({
      status: 'COMPLETED',
      finished_at: new Date()
    });
    
    // Update product stock
    const newStock = job.product.stock + job.qty;
    await job.product.update({ stock: newStock });
    
    res.json(job);
  } catch (error) {
    console.error('Error completing production job:', error);
    res.status(500).json({ error: 'Failed to complete production job' });
  }
};

// Delete production job
export const deleteProductionJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await ProductionJob.findByPk(id);
    if (!job) {
      return res.status(404).json({ error: 'Production job not found' });
    }
    
    await job.destroy();
    res.json({ message: 'Production job deleted successfully' });
  } catch (error) {
    console.error('Error deleting production job:', error);
    res.status(500).json({ error: 'Failed to delete production job' });
  }
};