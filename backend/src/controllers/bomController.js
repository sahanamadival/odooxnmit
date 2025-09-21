// src/controllers/bomController.js
import BOM from "../models/BOM.js";

export const createBOM = async (req, res) => {
  try {
    const bom = await BOM.create(req.body);
    res.status(201).json(bom);
  } catch (error) {
    res.status(500).json({ error: "Failed to create BOM", details: error.message });
  }
};

export const getAllBOMs = async (req, res) => {
  try {
    const boms = await BOM.findAll();
    res.json(boms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch BOMs", details: error.message });
  }
};

export const getBOMById = async (req, res) => {
  try {
    const bom = await BOM.findByPk(req.params.id);
    if (!bom) return res.status(404).json({ error: "BOM not found" });
    res.json(bom);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch BOM", details: error.message });
  }
};

export const updateBOM = async (req, res) => {
  try {
    const bom = await BOM.findByPk(req.params.id);
    if (!bom) return res.status(404).json({ error: "BOM not found" });

    await bom.update(req.body);
    res.json(bom);
  } catch (error) {
    res.status(500).json({ error: "Failed to update BOM", details: error.message });
  }
};

export const deleteBOM = async (req, res) => {
  try {
    const bom = await BOM.findByPk(req.params.id);
    if (!bom) return res.status(404).json({ error: "BOM not found" });

    await bom.destroy();
    res.json({ message: "BOM deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete BOM", details: error.message });
  }
};
