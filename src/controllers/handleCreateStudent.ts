import StudentService from "../services/StudentService";
import RFID_CardService from "../services/RFID_CardService";
import { Request, Response, NextFunction } from "express";
import { extractStudentData } from "./utils/extractStudentData";
import { Student } from "../types/student.types";

const handleCreateStudent = (
  sequelize: any,
  studentService: StudentService
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    // Start a transaction using Sequelize
    const transaction: any = await sequelize.transaction();

    try {
      // Extract student data and RFID ID from request
      const studentData: Student = extractStudentData(req.body);

      // Create the student record within the transaction
      const student = await studentService.createStudent(studentData, {
        transaction,
      });
      if (!student) {
        return res
          .status(500)
          .json({ success: false, msg: "Failed to create student!" });
      }
      // Commit the transaction to save all changes
      await transaction.commit();

      // Respond with the created student and card
      return res.status(201).json({ student });
    } catch (err) {
      // If any error occurs, rollback the transaction
      await transaction.rollback();
      return next(err);
    }
  };
};

export default handleCreateStudent;
