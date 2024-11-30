import { NextFunction, Response } from "express";

const listStudents = (sequelize: any, studentService: any, model: any) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const transaction: any = await sequelize.transaction();
    try {
      const students = await studentService.listStudents(model, req.tenantId);
      if (!students) {
        await transaction.rollback();
        return res
          .status(200)
          .json({ success: true, msg: "No students found", data: null });
      }

      await transaction.commit();
      return res
        .status(200)
        .json({ success: true, msg: "Fetched all students", data: students });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        msg: "Transaction failed",
        error: err.message,
      });
      await transaction.rollback();
      return next(err);
    }
  };
};

export default listStudents;
