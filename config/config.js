import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    pool: {
      max: 30, // Allow more connections during development
      min: 5, // Maintain a reasonable minimum
      acquire: 30000, // Wait longer to acquire a connection
      idle: 10000, // Release idle connections after 10 seconds
    },
    logging: false, // Enable logging for debugging
    host: "localhost",
    dialect: "postgres",
    dialectOptions: {
      keepAlive: true, // Maintain idle connections
    },
    retry: {
      max: 5, // Retry failed queries
    },
  },

  test: {
    url: process.env.TEST_DB_HOST, // Use the connection string
    dialect: "postgres",
    pool: {
      max: 30, // Allow more connections during development
      min: 5, // Maintain a reasonable minimum
      acquire: 30000, // Wait longer to acquire a connection
      idle: 10000, // Release idle connections after 10 seconds
    },
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for many managed PostgreSQL services like Render
      },
    },
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "postgres",
  },
};
