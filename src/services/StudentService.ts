import Sequelize from "sequelize";
import { Student } from "../types/student.types";

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
      return err;
    }
  }
  async uploadStudents(data: Student[], options: { transaction: any }) {
    try {
      // Attempt to bulk create students
      await this.model.bulkCreate(data, {
        transaction: options.transaction,
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
  //Get users form the database by Class
  async getAllStudentsbyClass() {
    return "Getting all students from database";
  }

  //Verify whether the RFID ID is registered on user.
  async checkStudentWithRFID_ID(rfid_ID: number) {
    return "Checking student in the database";
  }
}

export default StudentService;
