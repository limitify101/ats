import express from "express";
import handleAttendance from "../controllers/handleAttendance";
import AttendanceService from "../services/AttendanceService";

const attendanceRoutes = (sequelize: any, models: any) => {
  const router = express.Router();
  const attendanceService = new AttendanceService(models.Attendance);

  // Define route and pass the returned handler from handleAttendance
  router.post("/log", handleAttendance(sequelize, attendanceService, models));

  return router;
};

export default attendanceRoutes;
