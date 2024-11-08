import moment from "moment";
import { Attendance } from "../types/attendance.types";

class AttendanceService {
  client: any;
  models: any;
  constructor(sequelize: any, models: any) {
    this.models = models;
    this.client = sequelize;
  }

  async log(attendanceLog: Attendance, options: { transaction: any }) {
    try {
      const attendance = await this.models.Attendance.create(attendanceLog, {
        options,
      });
      return attendance;
    } catch (err: any) {
      throw err;
    }
  }

  async uploadLog(
    attendanceLog: Attendance[],
    { transaction }: { transaction: any }
  ) {
    try {
      await this.models.Attendance.bulkCreate(attendanceLog, {
        transaction, // Pass transaction here
      });
    } catch (err: any) {
      return err;
    }
  }
}

export default AttendanceService;
