import dayjs from "dayjs";
import { Response } from "express";
import AttendanceService from "../../services/AttendanceService";
import { ManualData } from "../../types/attendance.types";

const manualAttendance = (
  sequelize: any,
  attendanceService: AttendanceService
) => {
  return async (req: any, res: Response): Promise<any> => {
    const tenantID = req.tenantId; // Assuming req.tenantId is available from middleware
    const transaction = await sequelize.transaction(); // Begin a database transaction

    try {
      const manualLog: ManualData = req.body;

      // Extract `data` from the received log
      const { data } = manualLog;

      if (!data) {
        return res.status(400).json({
          success: false,
          msg: "Invalid request: Missing data field.",
        });
      }

      // Helper function to check if the date is today's date
      const isToday = (date: string): boolean => {
        return dayjs(date).isSame(dayjs(), "day");
      };

      // Validate date is today's date
      if (!isToday(data.date)) {
        return res.status(400).json({
          success: false,
          msg: "Only current date is allowed.",
        });
      }

      // Insert or update attendance record for the current date
      const result = await attendanceService.manualAttendance(
        data, // Pass extracted `data` here
        tenantID,
        transaction
      );

      // Commit the transaction on success
      await transaction.commit();

      // Send success response
      return res.status(201).json({
        success: true,
        msg: "Attendance successfully logged.",
        data: result,
      });
    } catch (err: any) {
      // Log the error
      console.error("Controller error:", err.message);

      // Rollback the transaction on error
      await transaction.rollback();

      // Send error response
      return res.status(500).json({
        success: false,
        msg: "An error occurred while logging manual attendance.",
        error: err.message,
      });
    }
  };
};

export default manualAttendance;
