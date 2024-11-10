import app from "../src/app";
import dotenv from "dotenv";
import db from "../models/index"; // db is the initialized models object
import studentRoutes from "./routes/student.routes";
import rfidRoutes from "./routes/rfid.routes";
import attendanceRoutes from "./routes/attendance.routes";
dotenv.config();

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Ensure models are initialized properly before syncing
    await db.sequelize.sync();

    console.log("Database in sync mode...");

    // Use models and Sequelize instance in your routes
    app.use(
      "/api/v1/student",
      studentRoutes(db.sequelize, db.Students, db.RFID_Cards)
    );
    app.use("/api/v1/rfid", rfidRoutes(db.sequelize, db));
    app.use("/api/v1/attendance", attendanceRoutes(db.sequelize, db));

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to sync database:", err);
  }
}

startServer();
