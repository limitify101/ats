import { NextFunction } from "express";
import RFID_CardService from "../../services/RFID_CardService";
import { RFID_CARD } from "../../types/rfid_card.types";
import { checkRFIDCardExistence } from "../utils/checkRFIDCardExistence";

const handleRFID = (sequelize: any, rfidCardService: RFID_CardService) => {
  return async (req: any, res: any, next: NextFunction): Promise<void> => {
    const transaction: any = await sequelize.transaction();
    try {
      if (!req.body.rfid_ID) {
        return res
          .status(400)
          .json({ success: false, error: "Please fill required fields" });
      }
      const tenantID = req.tenantId;
      const rfidData: RFID_CARD = req.body;
      const existingCard = await checkRFIDCardExistence(
        rfidCardService,
        rfidData.rfid_ID,
        tenantID
      );
      if (existingCard) {
        // Rollback the transaction if RFID exists
        await transaction.rollback();
        return res
          .status(409)
          .json({ success: false, error: "Card already in use." });
      }

      const card = await rfidCardService.createCard(
        { ...rfidData, tenantID },
        rfidData.studentID === null ? null : rfidData.studentID,
        transaction
      );
      await transaction.commit();
      return res.status(201).json({
        success: true,
        msg: "Registered new card successfully",
      });
    } catch (err: any) {
      await transaction.rollback();
      return next(err);
    }
  };
};

export default handleRFID;
