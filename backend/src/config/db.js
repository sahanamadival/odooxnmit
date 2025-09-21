import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,      // Database name
  process.env.MYSQL_USER,    // MySQL username
  process.env.MYSQL_PASS,    // MySQL password
    {
    host: process.env.MYSQL_HOST || "localhost",
    dialect: "mysql",
    logging: false,
    } 
);

export default sequelize;

