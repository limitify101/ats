import { NextFunction, Response } from "express";
import AttendanceService from "../../services/AttendanceService";

export const classAttendance = (
  sequelize: any,
  attendance: AttendanceService,
  Students: any
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const { date } = req.query; // Optional date filter
    const tenantID = req.tenantId;
    const transaction: any = await sequelize.transaction();
    try {
      // Fetch attendance data with related student information

      const attendanceData = await attendance.attendancePerClass(
        tenantID,
        date,
        Students
      );
      if (!attendanceData) {
        await transaction.rollback;
        return res
          .status(200)
          .json({ success: true, msg: "No attendance logs found", data: null });
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
