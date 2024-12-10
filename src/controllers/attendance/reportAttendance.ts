import { NextFunction, Response } from "express";

export const reportAttendance = (
  sequelize: any,
  attendanceService: any,
  model: any
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const transaction = await sequelize.transaction();
    const tenantID = req.tenantId;
    try {
      const { month, year } = req.query;
      const conditions: any = {};

      if (month) {
        conditions.month = month;
      }
      if (year) {
        conditions.year = year;
      }
      const report = await attendanceService.generateReport(
        conditions,
        model,
        tenantID
      );
      if (!report) {
        await transaction.rollback();
        return res
          .status(200)
          .json({ success: true, msg: "No report generated", data: report });
      }
      await transaction.commit();
      return res
        .status(200)
        .json({ success: true, msg: "Generated report", data: report });
    } catch (err: any) {
      await transaction.rollback();
      return res
        .status(500)
        .json({ success: false, msg: "Failed to generate report", error: err });
    }
  };
};

export default reportAttendance;
