// direct-registration-test.js - Direct test of registration function
import { Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
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

async function testDirectRegistration() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Initialize User model
    User.initModel(sequelize);
    
    await sequelize.sync({ alter: false });
    console.log("✅ Models synced.");

    // Test creating a user directly
    const testData = {
      username: `directtest_${Date.now()}`,
      email: `directtest_${Date.now()}@example.com`,
      password: await bcrypt.hash("password123", 10),
      role: "User"
    };

    console.log("🧪 Creating user with data:", { ...testData, password: "[HASHED]" });

    const user = await User.create(testData);
    console.log("✅ User created successfully!");
    console.log("User ID:", user.id);
    console.log("Username:", user.username);
    console.log("Email:", user.email);
    console.log("Role:", user.role);

    // Verify by fetching all users
    const allUsers = await User.findAll();
    console.log("\n📋 All users in database:");
    allUsers.forEach(u => {
      console.log(`  - ID: ${u.id}, Username: ${u.username}, Email: ${u.email}, Role: ${u.role}`);
    });

  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("Error details:", error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testDirectRegistration();