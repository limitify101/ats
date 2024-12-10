import { NextFunction, Response } from "express";
import AttendanceService from "../../services/AttendanceService";

const weeklyAttendance = (sequelize: any, attendance: AttendanceService) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const transaction = await sequelize.transaction();
    const tenantID = req.tenantId;
    try {
      const weeklyAttendance = await attendance.weeklyAttendance(tenantID);

      if (!weeklyAttendance) {
        await transaction.rollback();
        return res.status(200).json({
          success: true,
          msg: "No attendances found last week",
          data: [],
        });
      }

      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Found last week attendances successfully",
        weeklyAttendance,
      });
    } catch (err: any) {
      console.error("Error fetching weekly attendance details:", err);
      res
        .status(500)
        .json({ message: "Error fetching weekly attendance details" });
    }
  };
};

export default weeklyAttendance;
