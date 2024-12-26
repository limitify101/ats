import { Response } from "express";
import AttendanceService from "../../services/AttendanceService";
import { Attendance, ScanData } from "../../types/attendance.types";
import moment from "moment";
import { getStudentWithRFID } from "../../helpers/rfidHelper";

const handleAttendance = (
  sequelize: any,
  attendanceService: AttendanceService,
  models: any
) => {
  return async (req: any, res: Response): Promise<any> => {
    const tenantID = req.tenantId;
    const transaction = await sequelize.transaction();

    try {
      const Log: ScanData = req.body;
      const validArrivalTimeFormat = moment(Log.arrivalTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const parsedArrivalTime = moment(
        Log.arrivalTime,
        "YYYY-MM-DD HH:mm:ss"
      ).format("HH:mm"); // Parse time in 24-hour format

      // Fetch tenant-specific attendance settings
      const settings = await models.AttendanceSettings.findOne({
        where: { tenantID },
      });

      if (!settings) {
        console.log("Invalid data");
        return res.status(400).json({
          success: false,
          msg: "Attendance settings not configured for this tenant",
        });
      }

      const LATE_START_TIME = settings.startTime; // Start of late period
      const LATE_END_TIME = settings.endTime; // End of late period

      // Check if the student exists with the provided RFID
      const student = await getStudentWithRFID(Log.rfid_ID, models, tenantID);
      if (!student) {
        return res.status(404).send("Unauthorized card");
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
          date: today.format("YYYY-MM-DD"),
          tenantID,
        },
      });

      if (existingAttendance) {
        if (existingAttendance.attendance_status === "pending") {
          // Allow update if attendance is still pending
          await existingAttendance.update(
            {
              arrivalTime: validArrivalTimeFormat,
              attendance_status: attendanceStatus,
            },
            { transaction }
          );
        } else {
          // Disallow update if attendance is already marked as present or late
          return res.status(400).json({
            success: false,
            msg: "Attendance already marked. Updates are not allowed.",
          });
        }
      } else {
        // Log attendance if no record exists for today
        const attendance: Attendance = {
          studentID: student.studentID,
          arrivalTime: validArrivalTimeFormat,
          attendance_status: attendanceStatus,
          date: today.format("YYYY-MM-DD"),
          tenantID,
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
