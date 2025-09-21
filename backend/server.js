// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { dbInit } from "./src/models/index.js";

// Import route files
import authRoutes from "./src/routes/authRoutes.js";
import bomRoutes from "./src/routes/bomRoutes.js";
import manufacturingRoutes from "./src/routes/manufacturingRoutes.js";
import stockRoutes from "./src/routes/stockRoutes.js";
import workOrderRoutes from "./src/routes/workOrderRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import productionJobRoutes from "./src/routes/productionJobRoutes.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // React frontend URLs
  credentials: true
}));
app.use(express.json({ limit: "10mb" })); // Support JSON requests with size limit

// ✅ Base test route
app.get("/", (req, res) => {
  res.send("✅ Manufacturing Management System API is running...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bom", bomRoutes);
app.use("/api/manufacturing", manufacturingRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/workorders", workOrderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/production-jobs", productionJobRoutes);
app.use("/api/inventory", inventoryRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// ✅ Start DB + Server
const startServer = async () => {
  try {
    await dbInit();
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 CORS enabled for: http://localhost:3000, http://localhost:3001`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('❌ Server Error:', err);
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${PORT} is busy. Trying port ${PORT + 1}...`);
        server.listen(PORT + 1);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🔄 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🔄 SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed.');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("❌ Database Initialization Failed:", err);
    console.log("🔄 Retrying in 5 seconds...");
    setTimeout(() => {
      startServer();
    }, 5000);
  }
};

startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.log('🔄 Server will continue running...');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('🔄 Server will continue running...');
});
