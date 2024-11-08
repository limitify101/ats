import express, { Request, Response } from "express";
import RFID_CardService from "../services/RFID_CardService";
import handleRFID from "../controllers/handleRFIDCard";
import handleRfidUpload from "../controllers/handleRFIDCard_upload";
import upload from "../middleware/uploadCSV";

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
  return router;
};

export default rfidRoutes;
