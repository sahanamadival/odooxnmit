// src/controllers/stockController.js
import Stock from "../models/Stock.js";

export const createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ error: "Failed to create stock", details: error.message });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stocks", details: error.message });
  }
};

export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ error: "Stock not found" });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock", details: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ error: "Stock not found" });

    await stock.update(req.body);
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: "Failed to update stock", details: error.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ error: "Stock not found" });

    await stock.destroy();
    res.json({ message: "Stock deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete stock", details: error.message });
  }
};
