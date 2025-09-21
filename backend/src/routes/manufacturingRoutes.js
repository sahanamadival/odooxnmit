
import express from "express";
import ManufacturingOrder from "../models/ManufacturingOrder.js";

const router = express.Router();

// Create MO
router.post("/", async (req, res) => {
    try {
    const mo = new ManufacturingOrder(req.body);
    await mo.save();
    res.json(mo);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// Get all MOs
router.get("/", async (req, res) => {
    const orders = await ManufacturingOrder.find().populate("workOrders");
    res.json(orders);
});

export default router;