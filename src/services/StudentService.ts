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
  //Get users form the database by Class
  async getAllStudentsbyClass() {
    return "Getting all students from database";
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
