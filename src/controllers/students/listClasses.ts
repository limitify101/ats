import { NextFunction, Response } from "express";

const listClasses = (sequelize: any, studentService: any) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const transaction: any = await sequelize.transaction();
    try {
      const classes = await studentService.listClasses(req.tenantId);
      if (!classes) {
        await transaction.rollback();
        return res
          .status(200)
          .json({ success: true, msg: "No classes found", data: null });
      }
      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Fetched all classes",
        data: classes,
      });
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

export default listClasses;
