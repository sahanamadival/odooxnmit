// src/controllers/manufacturingController.js
import ManufacturingOrder from "../models/ManufacturingOrder.js";

export const createOrder = async (req, res) => {
  try {
    const order = await ManufacturingOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await ManufacturingOrder.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await ManufacturingOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order", details: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await ManufacturingOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await order.update(req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order", details: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await ManufacturingOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await order.destroy();
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order", details: error.message });
  }
};
