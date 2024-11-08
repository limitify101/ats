import express, { Request, Response } from "express";
import path from "path";
import "./register";
import sequelize from "./database/connection"; // Sequelize instance import
// import config from "./database/sequelize.config";
import dotenv from "dotenv";
dotenv.config();

import { fileURLToPath } from "url";
import studentRoutes from "./routes/student.routes";
import rfidRoutes from "./routes/rfid.routes";
import Models from "./database/models/index.model";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Static files setup
app.use(express.static(path.join(__dirname, "../app", "dist")));
app.use(express.json());
const models = Models(sequelize);
app.use("/api/v1/student", studentRoutes(sequelize, models)); // Pass sequelize
app.use("/api/v1/rfid", rfidRoutes(sequelize, models));
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
