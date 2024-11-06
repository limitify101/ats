import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Set up Sequelize connection and pooling
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "5432"), // Set the default port if not defined
  pool: {
    max: 30,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false, // Set this to true for SQL query logging (optional)
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default sequelize;
