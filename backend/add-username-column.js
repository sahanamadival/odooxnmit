// add-username-column.js - Script to add username column to existing users table
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

async function addUsernameColumn() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Check if users table exists
    const [tables] = await sequelize.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'"
    );

    if (tables[0].count === 0) {
      console.log("ℹ️ Users table doesn't exist. Will be created by sync.");
      return;
    }

    // Check if username column already exists
    const [columns] = await sequelize.query(
      "SELECT COUNT(*) as count FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'username'"
    );

    if (columns[0].count > 0) {
      console.log("ℹ️ Username column already exists.");
      return;
    }

    console.log("🔧 Adding username column to users table...");

    // Add username column with temporary nullable constraint
    await sequelize.query(
      "ALTER TABLE users ADD COLUMN username VARCHAR(255) NULL"
    );

    console.log("✅ Username column added.");

    // Check existing users and generate usernames
    const [existingUsers] = await sequelize.query(
      "SELECT id, email FROM users WHERE username IS NULL"
    );

    if (existingUsers.length > 0) {
      console.log(`🔧 Generating usernames for ${existingUsers.length} existing users...`);
      
      for (const user of existingUsers) {
        // Generate username from email (part before @) + user id
        const emailPrefix = user.email.split('@')[0];
        const username = `${emailPrefix}_${user.id}`;
        
        await sequelize.query(
          "UPDATE users SET username = ? WHERE id = ?",
          { replacements: [username, user.id] }
        );
        
        console.log(`  - User ID ${user.id}: ${user.email} → username: ${username}`);
      }
    }

    // Now make username NOT NULL and UNIQUE
    console.log("🔧 Making username column NOT NULL and UNIQUE...");
    
    await sequelize.query(
      "ALTER TABLE users MODIFY COLUMN username VARCHAR(255) NOT NULL"
    );
    
    await sequelize.query(
      "ALTER TABLE users ADD UNIQUE INDEX unique_username (username)"
    );

    console.log("✅ Username column migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration error:", error);
    
    if (error.message.includes("Duplicate entry")) {
      console.log("🔧 Handling duplicate usernames...");
      
      // Find and fix duplicate usernames
      const [duplicates] = await sequelize.query(
        "SELECT username, COUNT(*) as count FROM users GROUP BY username HAVING COUNT(*) > 1"
      );
      
      for (const dup of duplicates) {
        const [dupUsers] = await sequelize.query(
          "SELECT id FROM users WHERE username = ? ORDER BY id",
          { replacements: [dup.username] }
        );
        
        // Update all but the first duplicate
        for (let i = 1; i < dupUsers.length; i++) {
          const newUsername = `${dup.username}_${dupUsers[i].id}`;
          await sequelize.query(
            "UPDATE users SET username = ? WHERE id = ?",
            { replacements: [newUsername, dupUsers[i].id] }
          );
          console.log(`  - Fixed duplicate: ${dup.username} → ${newUsername}`);
        }
      }
      
      // Try adding unique constraint again
      await sequelize.query(
        "ALTER TABLE users ADD UNIQUE INDEX unique_username (username)"
      );
      
      console.log("✅ Duplicate usernames fixed and unique constraint added!");
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

addUsernameColumn();