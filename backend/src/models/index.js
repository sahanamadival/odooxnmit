import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import User from "./User.js";
import ManufacturingOrder from "./ManufacturingOrder.js";
import WorkOrder from "./WorkOrder.js";
import Stock from "./Stock.js";
import BOM from "./BOM.js";
import Product from "./Product.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import InventoryLog from "./InventoryLog.js";
import ProductionJob from "./ProductionJob.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  {
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

export const dbInit = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Initialize models
    User.initModel(sequelize);
    ManufacturingOrder.initModel(sequelize);
    WorkOrder.initModel(sequelize);
    Stock.initModel(sequelize);
    BOM.initModel(sequelize);
    Product.initModel(sequelize);
    Order.initModel(sequelize);
    OrderItem.initModel(sequelize);
    InventoryLog.initModel(sequelize);
    ProductionJob.initModel(sequelize);

    // Define relationships
    // User-Order relationship (One-to-Many)
    User.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
    Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });

    // Order-OrderItem relationship (One-to-Many)
    Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
    OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

    // Product-OrderItem relationship (One-to-Many)
    Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
    OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // Product-InventoryLog relationship (One-to-Many)
    Product.hasMany(InventoryLog, { foreignKey: 'product_id', as: 'inventoryLogs' });
    InventoryLog.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // Order-ProductionJob relationship (One-to-Many)
    Order.hasMany(ProductionJob, { foreignKey: 'order_id', as: 'productionJobs' });
    ProductionJob.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

    // Product-ProductionJob relationship (One-to-Many)
    Product.hasMany(ProductionJob, { foreignKey: 'product_id', as: 'productionJobs' });
    ProductionJob.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // Handle database sync with proper migration
    try {
      // Force sync to recreate tables with correct schema
      console.log("⚠️ Forcing database sync to fix schema issues...");
      await sequelize.sync({ force: true });
      console.log("✅ Database synced with force (tables recreated with correct schema).");
    } catch (syncError) {
      console.log("⚠️ Force sync failed, trying alter sync...");
      
      try {
        await sequelize.sync({ alter: true });
        console.log("✅ Database synced with alterations.");
      } catch (alterError) {
        console.log("⚠️ Alter sync failed, trying without alterations...");
        await sequelize.sync({ alter: false });
        console.log("✅ Database synced without alterations.");
      }
    }
  } catch (error) {
    console.error("❌ DB sync error:", error);
    
    // If still failing, suggest manual intervention
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log("\n🔧 Manual fix required:");
      console.log("1. Connect to your MySQL database");
      console.log("2. Run: UPDATE users SET username = CONCAT('user_', id) WHERE username = '' OR username IS NULL;");
      console.log("3. Restart the server\n");
    }
  }
};

export default sequelize;
export { User, ManufacturingOrder, WorkOrder, Stock, BOM, Product, Order, OrderItem, InventoryLog, ProductionJob };
