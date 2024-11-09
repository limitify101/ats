import { Request, Response } from "express";
import AttendanceService from "../services/AttendanceService";
import { Attendance, ScanData } from "../types/attendance.types";
import moment from "moment";
import { getStudentWithRFID } from "../helpers/rfidHelper";
import { Op } from "sequelize";
// Define the late time range constants
const LATE_START_TIME = "08:01"; // start of late period (e.g., 8 AM)
const LATE_END_TIME = "17:00"; // end of late period (e.g., 2 PM)

const handleAttendance = (
  sequelize: any,
  attendanceService: AttendanceService,
  models: any
) => {
  return async (req: Request, res: Response): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const Log: ScanData = req.body;
      const validArrivalTimeFormat = moment(Log.arrivalTime).format(
        "MMM DD, YYYY HH:mm:ss"
      );
      console.log(validArrivalTimeFormat);
      const parsedArrivalTime = moment(
        Log.arrivalTime,
        "MMM DD, YYYY HH:mm:ss"
      ).format("HH:mm"); // Parse time in 24-hour format
      console.log(parsedArrivalTime);
      // Check if the student exists with the provided RFID
      const student = await getStudentWithRFID(Log.rfid_ID, models);
      if (!student) {
        return res.status(404).json({
          success: false,
          msg: "No student found with the specified RFID ID",
          error: "Unauthorized",
        });
      }
      // Define attendance status based on arrival time
      let attendanceStatus: "present" | "late" | "absent" = "present";

      if (
        parsedArrivalTime >= LATE_START_TIME &&
        parsedArrivalTime <= LATE_END_TIME
      ) {
        attendanceStatus = "late";
      } else if (parsedArrivalTime > LATE_END_TIME) {
        attendanceStatus = "absent"; // Optionally mark as absent if after late range
      }

      // Check if an attendance record already exists for today
      const today = moment().startOf("day");
      const existingAttendance = await models.Attendance.findOne({
        where: {
          studentID: student.studentID,
          createdAt: {
            [Op.gte]: today.toDate(), // Records from today only
          },
        },
      });

      if (!existingAttendance) {
        // Log attendance if no record exists for today
        const attendance: Attendance = {
          studentID: student.studentID,
          arrivalTime: validArrivalTimeFormat,
          attendance_status: attendanceStatus,
        };

        await attendanceService.log(attendance, { transaction });
      }

      await transaction.commit();
      return res
        .status(200)
        .json({ success: true, msg: "Attendance logged successfully" });
    } catch (err: any) {
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        msg: "Error inserting data into database",
        error: err.message || err,
      });
    }
  };
};

export default handleAttendance;
