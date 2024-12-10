import { NextFunction, Response } from "express";

const viewStudent = (
  sequelize: any,
  studentService: any,
  Attendance: any,
  RFID_Cards: any
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const transaction = await sequelize.transaction();
    const { ID } = req.params;
    const tenantID = req.tenantId;
    try {
      const check = await studentService.checkStudentExists(ID, tenantID);
      if (!check) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ success: false, msg: "No student with specified ID" });
      }

      const student = await studentService.getStudent(
        ID,
        tenantID,
        Attendance,
        RFID_Cards
      );

      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Found student",
        data: student,
      });
    } catch (err: any) {
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        msg: "Failed to get student with specified ID",
        error: err,
      });
    }
  };
};

export default viewStudent;
