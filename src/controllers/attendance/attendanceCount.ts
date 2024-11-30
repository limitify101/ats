import { NextFunction, Response } from "express";
import AttendanceService from "../../services/AttendanceService";

export const presentAttendanceCount = (
  sequelize: any,
  attendanceService: AttendanceService
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const tenantID = req.tenantId;
    const transaction = await sequelize.transaction();

    try {
      const presence = await attendanceService.presentCount(tenantID);
      if (!presence) {
        await transaction.rollback();
        return res.status(200).json({
          success: true,
          msg: "No present students found",
          data: null,
        });
      }
      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Fetched present students",
        data: presence,
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

export const lateAttendanceCount = (
  sequelize: any,
  attendanceService: AttendanceService
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const tenantID = req.tenantId;
    const transaction = await sequelize.transaction();

    try {
      const late = await attendanceService.lateCount(tenantID);
      if (!late) {
        await transaction.rollback();
        return res.status(200).json({
          success: true,
          msg: "No late students found",
          data: null,
        });
      }
      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Fetched late students",
        data: late,
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

export const absentAttendanceCount = (
  sequelize: any,
  attendanceService: AttendanceService
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const tenantID = req.tenantId;
    const transaction = await sequelize.transaction();

    try {
      const absent = await attendanceService.absentCount(tenantID);
      if (!absent) {
        await transaction.rollback();
        return res.status(200).json({
          success: true,
          msg: "No absent students found",
          data: null,
        });
      }
      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Fetched absent students",
        data: absent,
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

export const presenceCountPerClass = (
  sequelize: any,
  attendanceService: AttendanceService,
  model: any
) => {
  return async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const tenantID = req.tenantId;
    const transaction = await sequelize.transaction();

    try {
      const presence = await attendanceService.presenceCountPerClass(
        tenantID,
        model
      );
      if (!presence) {
        await transaction.rollback();
        return res.status(200).json({
          success: true,
          msg: "No present students found",
          data: null,
        });
      }
      await transaction.commit();
      return res.status(200).json({
        success: true,
        msg: "Fetched present students",
        presence,
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
