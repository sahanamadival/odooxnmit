// check-table-structure.js - Verify the users table structure
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  {
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
    logging: true,
  }
);

async function checkTableStructure() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Check users table structure
    console.log("\n🔍 Checking users table structure:");
    const [columns] = await sequelize.query(
      "DESCRIBE users"
    );
    
    console.table(columns);

    // Check current data
    console.log("\n🔍 Current users data:");
    const [users] = await sequelize.query(
      "SELECT id, username, email, role, createdAt FROM users"
    );
    
    console.table(users);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

checkTableStructure();