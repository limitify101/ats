import StudentService from "../../services/StudentService";
import { Response, NextFunction } from "express";

const handleDeleteStudent = (
  sequelize: any,
  studentService: StudentService,
  rfidCards: any
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    // Start a transaction using Sequelize
    const transaction: any = await sequelize.transaction();
    const tenantID = req.tenantId;
    const { ID } = req.params;

    try {
      const existingStudent = await studentService.checkStudentExists(
        ID,
        tenantID
      );
      if (!existingStudent) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          msg: "No recorded student with specified ID",
        });
      }
      const student = await studentService.deleteStudent(ID, tenantID,transaction);

      if (!student) {
        return res
          .status(500)
          .json({ success: false, msg: "Failed to delete student!" });
      }
      // Commit the transaction to save all changes
      await transaction.commit();

      // Respond with the created student and card
      return res.status(201).json({
        success: true,
        msg: "Student deleted successfully",
      });
    } catch (err: any) {
      // If any error occurs, rollback the transaction
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        msg: "Failed deleting student",
        error: err.errors[0].message,
      });
    }
  };
};

export default handleDeleteStudent;
