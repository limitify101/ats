import Sequelize, { col, fn, where } from "sequelize";
import { Student } from "../types/student.types";
import { Op } from "sequelize";

class StudentService {
  model: any;
  static createStudent: any;
  static uploadStudents: any;

  constructor(model: any) {
    this.model = model;
  }
  /*
  Add a new Student to the database.
    * CSV or Manual.
  */
  async createStudent(std: Student, options: { transaction: any }) {
    try {
      const student = await this.model.create(std, {
        transaction: options.transaction,
        validate: true,
      });
      return student;
    } catch (err: any) {
      throw err;
    }
  }
  async deleteStudent(studentID: any, tenantID: any, transaction: any) {
    try {
      const student = await this.model.destroy({
        where: {
          studentID: studentID,
          tenantID: tenantID,
        },
        transaction,
      });
      return student;
    } catch (err: any) {
      return err;
    }
  }
  async uploadStudents(data: Student[], options: { transaction: any }) {
    try {
      // Attempt to bulk create students
      const response = await this.model.bulkCreate(data, {
        transaction: options.transaction,
        validate: true,
      });
      return response;
    } catch (err: any) {
      // Handle specific Sequelize errors
      if (err instanceof Sequelize.UniqueConstraintError) {
        throw new Error(
          "Unique constraint violation: " +
            err.errors.map((e: any) => e.message).join(", ")
        );
      } else {
        // Rethrow any other errors
        throw err;
      }
    }
  }
  async listStudents(RFID_Cards: any, tenantID: any) {
    try {
      const students = await this.model.findAll({
        attributes: ["studentID", "studentName", "grade", "status"],
        where: {
          tenantID: {
            [Op.eq]: tenantID,
          },
        },
        include: [
          {
            model: RFID_Cards,
            as: "rfidCard",
            attributes: ["studentID"],
          },
        ],
        order: ["grade", "studentName"],
      });
      return students;
    } catch (err: any) {
      throw err;
    }
  }
  async getStudent(
    studentID: any,
    tenantID: any,
    Attendance: any,
    RFID_Cards: any
  ) {
    try {
      // Fetch the student and associated data
      const student = await this.model.findOne({
        where: {
          studentID: studentID,
          tenantID: tenantID,
        },
        include: [
          {
            model: Attendance,
            as: "attendance",
          },
          {
            model: RFID_Cards,
            as: "rfidCard",
          },
        ],
      });

      // If the student is not found, handle the case
      if (!student) {
        throw new Error("Student not found");
      }

      // Calculate attendance statistics
      const attendanceRecords = student.attendance || [];
      const totalRecords = attendanceRecords.length;

      const presentCount = attendanceRecords.filter(
        (record: any) => record.attendance_status === "present"
      ).length;
      const lateCount = attendanceRecords.filter(
        (record: any) => record.attendance_status === "late"
      ).length;
      const absentCount = attendanceRecords.filter(
        (record: any) => record.attendance_status === "absent"
      ).length;

      const presentPercentage = totalRecords
        ? ((presentCount / totalRecords) * 100).toFixed(2) + "%"
        : "0%";
      const latePercentage = totalRecords
        ? ((lateCount / totalRecords) * 100).toFixed(2) + "%"
        : "0%";
      const absentPercentage = totalRecords
        ? ((absentCount / totalRecords) * 100).toFixed(2) + "%"
        : "0%";

      // Construct the output format
      const result = {
        studentID: student.studentID,
        name: `${student.studentName}`,
        gender: student.gender,
        grade: student.grade,
        contact: student.contact,
        status: student.status,
        present: presentPercentage,
        late: latePercentage,
        absent: absentPercentage,
        cardID: student.rfidCard?.rfid_ID || "N/A",
        cardActive: student.rfidCard?.activated,
      };

      return result;
    } catch (err: any) {
      throw err;
    }
  }

  async listClasses(tenantID: any) {
    try {
      const results = await this.model.findAll({
        attributes: [
          "grade",
          [Sequelize.fn("COUNT", Sequelize.col("studentID")), "studentsCount"],
        ],
        group: ["grade"],
        where: {
          tenantID: {
            [Op.eq]: tenantID,
          },
        },
        order: ["grade"],
        raw: true,
      });
      const classes = results.map((entry: any) => entry);
      return classes;
    } catch (err: any) {
      console.error("Error fetching distinct grades:", err);
      throw err;
    }
  }

  //Verify whether the Student ID is registered on user.
  async checkStudentExists(studentID: any, tenantID: any) {
    try {
      const response = await this.model.findOne({
        where: {
          studentID: studentID,
          tenantID: tenantID,
        },
      });
      return response;
    } catch (err: any) {
      return err;
    }
  }
}

export default StudentService;
