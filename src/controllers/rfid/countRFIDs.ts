import { NextFunction, Request, Response } from "express";

export const countActiveRFID = (sequelize: any, rfidService: any) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const transaction: any = await sequelize.transaction();
    try {
      const rfid = await rfidService.countActiveCards(req.tenantId);
      if (!rfid) {
        await transaction.rollback();
        return res
          .status(200)
          .json({ success: true, msg: "No active cards found", data: null });
      }

      await transaction.commit();
      return res
        .status(200)
        .json({ success: true, msg: "Fetched active cards", data: rfid });
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

export const countInactiveRFID = (sequelize: any, rfidService: any) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const transaction: any = await sequelize.transaction();
    try {
      const rfid = await rfidService.countInactiveCards(req.tenantId);
      if (!rfid) {
        await transaction.rollback();
        return res
          .status(200)
          .json({ success: true, msg: "No inactive cards found", data: null });
      }

      await transaction.commit();
      return res
        .status(200)
        .json({ success: true, msg: "Fetched inactive cards", data: rfid });
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
