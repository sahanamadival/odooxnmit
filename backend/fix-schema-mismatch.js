// fix-schema-mismatch.js - Fix all schema mismatches
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

async function fixSchemaMismatch() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    console.log("🔧 Fixing schema mismatches...");

    // 1. Drop and recreate the role enum with correct values
    console.log("1. Updating role enum values...");
    
    // First, set all roles to a temporary value
    await sequelize.query(
      "UPDATE users SET role = 'CUSTOMER' WHERE role NOT IN ('ADMIN', 'CUSTOMER')"
    );
    
    // Modify the enum to include new values
    await sequelize.query(
      "ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN','MANUFACTURER','ACCOUNTANT','CUSTOMER','User','Manager','Supervisor','Admin') DEFAULT 'User'"
    );
    
    // Update existing values to new enum
    await sequelize.query("UPDATE users SET role = 'Admin' WHERE role = 'ADMIN'");
    await sequelize.query("UPDATE users SET role = 'User' WHERE role = 'CUSTOMER'");
    await sequelize.query("UPDATE users SET role = 'Manager' WHERE role = 'MANUFACTURER'");
    await sequelize.query("UPDATE users SET role = 'Supervisor' WHERE role = 'ACCOUNTANT'");
    
    // Now set the enum to only the new values
    await sequelize.query(
      "ALTER TABLE users MODIFY COLUMN role ENUM('User','Manager','Supervisor','Admin') DEFAULT 'User'"
    );
    
    console.log("✅ Role enum updated");

    // 2. Add proper timestamp columns that Sequelize expects
    console.log("2. Fixing timestamp columns...");
    
    try {
      await sequelize.query(
        "ALTER TABLE users ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP"
      );
      await sequelize.query(
        "ALTER TABLE users ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      );
      
      // Copy data from old timestamp columns
      await sequelize.query(
        "UPDATE users SET createdAt = created_at, updatedAt = updated_at"
      );
      
      console.log("✅ Timestamp columns added");
    } catch (timestampError) {
      if (timestampError.message.includes("Duplicate column")) {
        console.log("ℹ️ Timestamp columns already exist");
      } else {
        throw timestampError;
      }
    }

    // 3. Remove the old 'name' column since we're using 'username' now
    console.log("3. Checking old 'name' column...");
    
    try {
      // Check if anyone is missing a username but has a name
      const [usersWithoutUsername] = await sequelize.query(
        "SELECT id, name, username FROM users WHERE username IS NULL OR username = ''"
      );
      
      if (usersWithoutUsername.length > 0) {
        console.log(`🔧 Updating ${usersWithoutUsername.length} users without usernames...`);
        for (const user of usersWithoutUsername) {
          const username = user.name ? user.name.replace(/\s+/g, '_').toLowerCase() + '_' + user.id : 'user_' + user.id;
          await sequelize.query(
            "UPDATE users SET username = ? WHERE id = ?",
            { replacements: [username, user.id] }
          );
          console.log(`  - User ID ${user.id}: ${user.name} → ${username}`);
        }
      }
    } catch (nameError) {
      console.log("ℹ️ Name column handling skipped:", nameError.message);
    }

    console.log("🔍 Final table structure:");
    const [finalColumns] = await sequelize.query("DESCRIBE users");
    console.table(finalColumns);

    console.log("🔍 Updated users data:");
    const [finalUsers] = await sequelize.query(
      "SELECT id, username, email, role FROM users LIMIT 5"
    );
    console.table(finalUsers);

    console.log("✅ Schema migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

fixSchemaMismatch();