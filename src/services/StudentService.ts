import Sequelize from "sequelize";
import { Student } from "../types/student.types";

class StudentService {
  client: any;
  models: any;
  static createStudent: any;
  constructor(sequelize: any, models: any) {
    this.client = sequelize;
    this.models = models;
  }
  /*
  Add a new Student to the database.
    * CSV or Manual.
  */
  async createStudent(std: Student, p0: { transaction: any }) {
    try {
      const student = await this.models.Students.create(std);
      return student;
    } catch (err: any) {
      return err;
    }
  }
  //Get user form the database
  async getAllStudentsbyClass() {
    return "Getting all students from database";
  }

  async uploadStudents(data: Student[], p0: { transaction: any }) {
    try {
      // Attempt to bulk create students
      await this.models.Students.bulkCreate(data, {
        transaction: p0.transaction,
        validate: true,
      });
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
  //Verify whether the RFID ID is registered on user.
  async checkStudentWithRFID_ID(rfid_ID: number) {
    return "Checking student in the database";
  }

  //Change status to present.
  async setAttendance() {
    return "Student attendance is being set...";
  }
}

export default StudentService;
