import express from "express";
import handleAttendance from "../controllers/attendance/handleAttendance";
import AttendanceService from "../services/AttendanceService";
import extractTenantId from "../middleware/extractTenantID";
import listAttendanceLogs from "../controllers/attendance/listAttendanceLog";

import {
  absentAttendanceCount,
  lateAttendanceCount,
  presenceCountPerClass,
  presentAttendanceCount,
} from "../controllers/attendance/attendanceCount";
import { classAttendance } from "../controllers/attendance/classAttendance";
import manualAttendance from "../controllers/attendance/manualAttendance";
import reportAttendance from "../controllers/attendance/reportAttendance";
import weeklyAttendance from "../controllers/attendance/weeklyAttendance";

const attendanceRoutes = (sequelize: any, models: any) => {
  const router = express.Router();
  const attendanceService = new AttendanceService(models.Attendance);

  // Define route and pass the returned handler from handleAttendance
  router.post(
    "/log",
    extractTenantId,
    handleAttendance(sequelize, attendanceService, models)
  );
  router.get(
    "/list",
    extractTenantId,
    listAttendanceLogs(sequelize, attendanceService, models.Students)
  );
  router.get(
    "/count-present",
    extractTenantId,
    presentAttendanceCount(sequelize, attendanceService)
  );
  router.get(
    "/count-late",
    extractTenantId,
    lateAttendanceCount(sequelize, attendanceService)
  );
  router.get(
    "/count-absent",
    extractTenantId,
    absentAttendanceCount(sequelize, attendanceService)
  );

  router.get(
    "/class-details",
    extractTenantId,
    classAttendance(sequelize, attendanceService, models.Students, models)
  );
  router.get(
    "/class-present",
    extractTenantId,
    presenceCountPerClass(sequelize, attendanceService, models.Students)
  );
  router.post(
    "/manual",
    extractTenantId,
    manualAttendance(sequelize, attendanceService)
  );
  router.get(
    "/weekly-summary",
    extractTenantId,
    weeklyAttendance(sequelize, attendanceService)
  );
  router.get(
    "/report",
    extractTenantId,
    reportAttendance(sequelize, attendanceService, models.Students)
  );
  return router;
};

export default attendanceRoutes;
