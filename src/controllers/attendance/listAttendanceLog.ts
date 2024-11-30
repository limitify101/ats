import { NextFunction, Response } from "express";

const listAttendanceLogs = (
  sequelize: any,
  attendanceService: any,
  model: any
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const transaction: any = await sequelize.transaction();
    try {
      const { classroom: className, date: dateSet } = req.query;
      const conditions: any = {};
      conditions.tenantID = req.tenantId;

      if (className) {
        conditions.grade = className;
      }
      if (dateSet) {
        conditions.date = dateSet;
      }

      const filteredAttendances = await attendanceService.filteredAttendance(
        conditions,
        model
      );
      if (!filteredAttendances) {
        await transaction.rollback();
        return res
          .status(200)
          .json({ success: true, msg: "No attendace logs found", data: null });
      }
      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Fetched all attendance logs",
        data: filteredAttendances,
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

export default listAttendanceLogs;
