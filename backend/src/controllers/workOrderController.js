import WorkOrder from "../models/WorkOrder.js";
import { getDelayRisk } from "../services/aiService.js";

// Create WorkOrder
export const createWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.create(req.body);

    // Call AI service to predict delay risk (optional)
    try {
      const risk = await getDelayRisk(workOrder);
      workOrder.delayRisk = risk;
      await workOrder.save();
    } catch (aiError) {
      console.log("⚠️ AI Service unavailable, using default delay risk");
      // Continue without AI prediction
    }

    res.status(201).json(workOrder);
  } catch (error) {
    console.error("❌ Create WorkOrder Error:", error);
    res.status(500).json({
      error: "Failed to create work order",
      details: error.message,
    });
  }
};

// Get all WorkOrders
export const getAllWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.findAll();
    res.json(workOrders);
  } catch (error) {
    console.error("❌ Get WorkOrders Error:", error);
    res.status(500).json({
      error: "Failed to fetch work orders",
      details: error.message,
    });
  }
};

// Get WorkOrder by ID
export const getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByPk(req.params.id);
    if (!workOrder)
      return res.status(404).json({ error: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch work order",
      details: error.message,
    });
  }
};

// Update WorkOrder
export const updateWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByPk(req.params.id);
    if (!workOrder)
      return res.status(404).json({ error: "Work order not found" });

    await workOrder.update(req.body);

    // Recalculate delay risk after update (optional)
    try {
      const risk = await getDelayRisk(workOrder);
      workOrder.delayRisk = risk;
      await workOrder.save();
    } catch (aiError) {
      console.log("⚠️ AI Service unavailable during update");
      // Continue without AI prediction
    }

    res.json(workOrder);
  } catch (error) {
    console.error("❌ Update WorkOrder Error:", error);
    res.status(500).json({
      error: "Failed to update work order",
      details: error.message,
    });
  }
};

// Delete WorkOrder
export const deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByPk(req.params.id);
    if (!workOrder)
      return res.status(404).json({ error: "Work order not found" });

    await workOrder.destroy();
    res.json({ message: "Work order deleted" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete work order",
      details: error.message,
    });
  }
};


