import StudentService from "../services/StudentService";
import RFID_CardService from "../services/RFID_CardService";
import { Request, Response, NextFunction } from "express";
import { extractStudentData } from "./utils/extractStudentData";
import { checkRFIDCardExistence } from "./utils/checkRFIDCardExistence";
import { Student } from "../types/student.types";

const handleCreateStudent = (
  sequelize: any,
  studentService: StudentService,
  rfidCardService: RFID_CardService
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
      const { rfid_ID } = req.body;

      // Check if RFID card already exists
      const existingCard = await checkRFIDCardExistence(
        rfidCardService,
        rfid_ID
      );
      if (existingCard) {
        // Rollback the transaction if RFID exists
        await transaction.rollback();
        return res.status(409).json({ error: "RFID ID already in use." });
      }

      // Create the student record within the transaction
      const student = await studentService.createStudent(studentData, {
        transaction,
      });

      // Create the RFID card linked to the student within the transaction
      const card = await rfidCardService.createCard(
        { rfid_ID, activated: true },
        student.studentID,
        { transaction }
      );

      // Commit the transaction to save all changes
      await transaction.commit();

      // Respond with the created student and card
      return res.status(201).json({ student, card });
    } catch (err) {
      // If any error occurs, rollback the transaction
      await transaction.rollback();
      return next(err);
    }
  };
};

export default handleCreateStudent;
