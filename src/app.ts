import express from "express";
import path from "path";
import cors from "cors";
import studentRoutes from "./routes/student.routes";
import rfidRoutes from "./routes/rfid.routes";
import attendanceRoutes from "./routes/attendance.routes";
import db from "../models";
import fs from "fs";
import clientRoutes from "./routes/client.routes";
import ClientService from "./services/ClientService";
import initializeCronJobs, {
  getNextCronSchedule,
} from "./utils/cronJobs/resetAttendance";
import { DateTime } from "luxon";
import extractTenantId from "./middleware/extractTenantID";

// Initialize express app
const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Static files and middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "../templates")));
app.use(express.static(path.join(__dirname, "../app/dist")));
app.use(express.json());

// Function to initialize attendance cron jobs
async function INIT_ATTENDANCE() {
  try {
    const clientService = new ClientService(db.AttendanceSettings);
    const tenants = await clientService.getAllTenants();

    if (!tenants || tenants.length === 0) {
      console.warn("No tenants found. Skipping cron job initialization.");
      return;
    }

    // Concurrently initialize cron jobs for all tenants
    await Promise.all(
      tenants.map((tenant: any) =>
        initializeCronJobs(clientService, tenant.tenantID, db)
      )
    );

    console.log("All tenant cron jobs initialized!");
  } catch (error) {
    console.error("Error during attendance startup:", error);
  }
}

// Function to sync the database
async function SYNC_DB() {
  try {
    await db.sequelize.sync({}); // Ensure tables are synced; use `{ force: true }` for dev resets.
    console.log("Database synchronized...");
    await INIT_ATTENDANCE(); // Initialize cron jobs after syncing database
  } catch (err: any) {
    console.error("Failed to sync database:", err);
  }
}

// Call the database sync function
SYNC_DB();

// API routes
app.use("/api/v1/client", clientRoutes(db.sequelize, db.AttendanceSettings));
app.use(
  "/api/v1/student",
  studentRoutes(db.sequelize, db.Students, db.RFID_Cards, db.Attendance)
);
app.use("/api/v1/rfid", rfidRoutes(db.sequelize, db));
app.use("/api/v1/attendance", attendanceRoutes(db.sequelize, db));

// Endpoint to manually initialize a cron job for a specific tenant
app.post(
  "/api/v1/initialize-cron",
  extractTenantId,
  async (req: any, res: any) => {
    try {
      const tenantID = req.tenantId; // Pass tenantID from frontend
      if (!tenantID)
        return res.status(400).json({ error: "Tenant ID required" });

      const { startTime, endTime } = req.body;
      const clientService = new ClientService(db.AttendanceSettings);
      await clientService.updateClientSettings(tenantID, {
        startTime,
        endTime,
      });
      await initializeCronJobs(clientService, tenantID, db);
      res.status(200).json({ message: "Schedule initialized successfully!" });
    } catch (error) {
      console.error("Error initializing schedule:", error);
      res.status(500).json({ error: "Failed to initialize cron job" });
    }
  }
);
//Cron Job info

// const TIMEZONE = "Africa/Kigali";

app.get("/api/v1/cron-schedule", extractTenantId, (req: any, res: any) => {
  try {
    const tenantId = req.tenantId;

    // Fetch the next cron schedules
    const initializeAttendanceTime = getNextCronSchedule(
      tenantId,
      "initializeAttendance"
    );
    const setAbsentTime = getNextCronSchedule(tenantId, "setAbsent");

    // Convert to Africa/Kigali timezone
    const response = {
      initializeAttendance: initializeAttendanceTime
        ? DateTime.fromJSDate(initializeAttendanceTime).toFormat(
            "yyyy-MM-dd HH:mm:ss"
          )
        : null,
      setAbsent: setAbsentTime
        ? DateTime.fromJSDate(setAbsentTime).toFormat("yyyy-MM-dd HH:mm:ss")
        : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cron schedules. Please try again later.",
    });
  }
});
app.get("/student/download-template", (req: any, res: any) => {
  const filePath = path.join(
    __dirname,
    "../templates",
    "Students_Template.csv"
  );

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", err.message);
      return res.status(404).send("Template not found");
    }

    res.download(filePath, "Students_Template.csv", (err: any) => {
      if (err) {
        console.error("Error sending file:", err.message);
        res.status(500).send("Error downloading the file");
      }
    });
  });
});
app.get("/card/download-template", (req: any, res: any) => {
  const filePath = path.join(__dirname, "../templates", "Card_Template.csv");
  res.download(filePath, "Card_Template.csv", (err: any) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error downloading the file");
    }
  });
});

// Static file handling (frontend app)
app.get("*", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "../app/dist", "index.html"));
});

export default app;
