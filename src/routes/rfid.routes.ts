import express, { Request, Response } from "express";
import RFID_CardService from "../services/RFID_CardService";
import handleRFID from "../controllers/handleRFIDCard";
import handleRfidUpload from "../controllers/handleRFIDCard_upload";
import upload from "../middleware/uploadCSV";
import assignRFIDsToStudents from "../controllers/assignRFIDtoStudents";

const rfidRoutes = (sequelize: any, models: any) => {
  const router = express.Router();

  const rfidCardService = new RFID_CardService(sequelize, models);

  // Generating rfid cards.
  router.post("/set", handleRFID(sequelize, rfidCardService));
  router.post(
    "/upload",
    upload.single("csv"),
    handleRfidUpload(sequelize, rfidCardService)
  );
  router.post("/assign", async (req: any, res: any) => {
    try {
      await assignRFIDsToStudents(sequelize, models);
      return res.status(201).json({
        success: true,
        msg: "RFIDs assigned to unassigned students successfully.",
      });
    } catch (err: any) {
      console.error("Error assigning RFIDs:", err);
      res.status(500).json({
        success: false,
        message: "Error assigning RFIDs",
        error: err.message,
      });
    }
  });
  return router;
};

export default rfidRoutes;
