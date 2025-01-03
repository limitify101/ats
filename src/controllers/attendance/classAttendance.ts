import { NextFunction, Response } from "express";
import AttendanceService from "../../services/AttendanceService";
import { initializeDailyAttendance } from "../../helpers/attendanceHelper";

export const classAttendance = (
  sequelize: any,
  attendance: AttendanceService,
  Students: any,
  models: any
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const { date } = req.query; // Optional date filter
    const tenantID = req.tenantId;
    const transaction: any = await sequelize.transaction();

    try {
      // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const currentDay = new Date().getDay();

      // Initialize daily attendance only on weekdays (Monday to Friday)
      if (currentDay >= 1 && currentDay <= 5) {
        await transaction.rollback(); // Rollback if necessary
        await initializeDailyAttendance(models, tenantID); // Initialize attendance
      }

      // Fetch attendance data with related student information
      let attendanceData = await attendance.attendancePerClass(
        tenantID,
        date,
        Students
      );

      // If no attendance data is found, return early with a message
      if (!attendanceData || attendanceData.length === 0) {
        return res.status(200).json({
          success: true,
          msg: "No attendance logs found.",
          data: null,
        });
      }

      // Transform data into the desired format
      const groupedData = attendanceData.reduce((result: any, record: any) => {
        const className = record["student.grade"]; // Extract class/grade
        const student = {
          studentName: `${record["student.studentName"]}`,
          studentID: record["student.studentID"],
          status: record.attendance_status,
          arrivalTime: record.arrivalTime,
          notes: record.notes || "N/A",
        };

        // Find or create a class entry
        let classEntry = result.find(
          (entry: any) => entry.className === className
        );
        if (!classEntry) {
          classEntry = { className, students: [] };
          result.push(classEntry);
        }

        // Add student to the class
        classEntry.students.push(student);

        return result;
      }, []);

      // Return the grouped attendance data
      res.status(200).json({
        success: true,
        msg: "Fetched class attendance",
        data: groupedData,
      });
    } catch (err) {
      console.error("Error fetching attendance details:", err);
      res.status(500).json({ message: "Error fetching attendance details" });
    }
  };
};
