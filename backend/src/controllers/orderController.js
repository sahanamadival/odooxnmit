import { Order, OrderItem, Product, User, ProductionJob } from '../models/index.js';

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
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
              as: 'product',
              attributes: ['id', 'name', 'sku']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
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
        },
        {
          model: ProductionJob,
          as: 'productionJobs'
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { customer_id, items } = req.body; // items: [{ product_id, qty, price }]
    
    // Validate customer exists
    const customer = await User.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Calculate total amount
    let total_amount = 0;
    for (const item of items) {
      total_amount += item.qty * item.price;
    }
    
    // Create order
    const order = await Order.create({
      customer_id,
      total_amount,
      status: 'PENDING'
    });
    
    // Create order items
    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        qty: item.qty,
        price: item.price
      });
    }
    
    // Fetch complete order data
    const completeOrder = await Order.findByPk(order.id, {
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
    });
    
    res.status(201).json(completeOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await order.update({ status });
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

// Get orders by customer
export const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const orders = await Order.findAll({
      where: { customer_id: customerId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sku']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
};