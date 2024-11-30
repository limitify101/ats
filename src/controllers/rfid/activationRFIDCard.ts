import RFID_CardService from "../../services/RFID_CardService";
import { NextFunction } from "express";
import { checkRFIDCardExistence } from "../utils/checkRFIDCardExistence";

export const deactivateRFIDCard = (
  sequelize: any,
  rfidCardService: RFID_CardService
) => {
  return async (req: any, res: any, next: NextFunction): Promise<any> => {
    const transaction = await sequelize.transaction();
    const { id } = req.params;
    const tenantID = req.tenantId;
    try {
      if (!id) {
        return;
      }
      const card = await checkRFIDCardExistence(rfidCardService, id, tenantID);
      if (!card) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ success: false, error: "No such card found! " });
      }

      const result = await rfidCardService.deactivateCard(
        card.rfid_ID,
        tenantID,
        transaction
      );
      await transaction.commit();
      return res.status(201).json({
        success: true,
        msg: "Deactivated card successfully",
        data: result,
      });
    } catch (err: any) {
      await transaction.rollback();
      return next(err);
    }
  };
};

export const activateRFIDCard = (
  sequelize: any,
  rfidCardService: RFID_CardService
) => {
  return async (req: any, res: any, next: NextFunction): Promise<any> => {
    const transaction = await sequelize.transaction();
    const { id } = req.params;
    const tenantID = req.tenantId;
    try {
      if (!id) {
        return;
      }
      const card = await checkRFIDCardExistence(rfidCardService, id, tenantID);
      if (!card) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ success: false, error: "No such card found! " });
      }

      const result = await rfidCardService.activateCard(
        card.rfid_ID,
        tenantID,
        transaction
      );
      await transaction.commit();
      return res.status(201).json({
        success: true,
        msg: "Activated card successfully",
        data: result,
      });
    } catch (err: any) {
      await transaction.rollback();
      return next(err);
    }
  };
};
