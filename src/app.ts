import express, { Request, Response } from "express";
import path from "path";
import db from "../models/index";

import studentRoutes from "../src/routes/student.routes";
import rfidRoutes from "../src/routes/rfid.routes";
import attendanceRoutes from "../src/routes/attendance.routes";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Static files setup
app.use(express.static(path.join(__dirname, "../app", "dist")));
app.use(express.json());

//Routes
app.use("/api/v1/student", studentRoutes(db.sequelize, db));
app.use("/api/v1/rfid", rfidRoutes(db.sequelize, db));
app.use("/api/v1/attendance", attendanceRoutes(db.sequelize, db));

// Static file routes
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../app", "dist", "index.html"));
});
app.get("/login", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../app", "dist", "login.html"));
});
app.get("/register", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../app", "dist", "register.html"));
});

export default app;
