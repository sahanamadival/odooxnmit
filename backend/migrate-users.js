// migrate-users.js - Script to fix username constraint issues
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

async function migrateUsers() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Check if users table exists
    const [tables] = await sequelize.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'"
    );

    if (tables[0].count === 0) {
      console.log("ℹ️ Users table doesn't exist yet. No migration needed.");
      return;
    }

    // Check if username column exists
    const [columns] = await sequelize.query(
      "SELECT COUNT(*) as count FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'username'"
    );

    if (columns[0].count === 0) {
      console.log("ℹ️ Username column doesn't exist yet. No migration needed.");
      return;
    }

    // Check for users with empty or null usernames
    const [emptyUsers] = await sequelize.query(
      "SELECT id, username, email FROM users WHERE username = '' OR username IS NULL"
    );

    if (emptyUsers.length > 0) {
      console.log(`⚠️ Found ${emptyUsers.length} users with empty usernames:`);
      emptyUsers.forEach(user => {
        console.log(`  - User ID: ${user.id}, Email: ${user.email || 'N/A'}, Username: '${user.username || 'NULL'}'`);
      });

      // Update empty usernames to unique values
      console.log("🔧 Updating empty usernames...");
      await sequelize.query(
        "UPDATE users SET username = CONCAT('user_', id) WHERE username = '' OR username IS NULL"
      );

      // Verify the update
      const [updatedUsers] = await sequelize.query(
        "SELECT id, username, email FROM users WHERE username LIKE 'user_%'"
      );

      console.log("✅ Updated usernames:");
      updatedUsers.forEach(user => {
        console.log(`  - User ID: ${user.id}, Email: ${user.email || 'N/A'}, Username: '${user.username}'`);
      });
    } else {
      console.log("✅ No users with empty usernames found.");
    }

    // Check for duplicate usernames
    const [duplicates] = await sequelize.query(
      "SELECT username, COUNT(*) as count FROM users GROUP BY username HAVING COUNT(*) > 1"
    );

    if (duplicates.length > 0) {
      console.log("⚠️ Found duplicate usernames:");
      for (const dup of duplicates) {
        console.log(`  - Username: '${dup.username}' appears ${dup.count} times`);
        
        // Get all users with this duplicate username
        const [dupUsers] = await sequelize.query(
          "SELECT id, username, email FROM users WHERE username = ?",
          { replacements: [dup.username] }
        );

        // Update all but the first one
        for (let i = 1; i < dupUsers.length; i++) {
          const newUsername = `${dup.username}_${dupUsers[i].id}`;
          await sequelize.query(
            "UPDATE users SET username = ? WHERE id = ?",
            { replacements: [newUsername, dupUsers[i].id] }
          );
          console.log(`    - Updated user ID ${dupUsers[i].id} to username: '${newUsername}'`);
        }
      }
    } else {
      console.log("✅ No duplicate usernames found.");
    }

    console.log("✅ User migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

migrateUsers();