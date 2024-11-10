import { Attendance } from "../types/attendance.types";

class AttendanceService {
  model: any;
  constructor(model: any) {
    this.model = model;
  }

  async log(attendanceLog: Attendance, options: { transaction: any }) {
    try {
      const attendance = await this.model.create(attendanceLog, {
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
      await this.model.bulkCreate(attendanceLog, {
        transaction, // Pass transaction here
      });
    } catch (err: any) {
      return err;
    }
  }
}

export default AttendanceService;
