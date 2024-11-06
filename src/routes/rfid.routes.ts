import express, { Request, Response } from "express";
import RFID_CardService from "../services/RFID_CardService";
import handleRFID from "../controllers/handleRFIDCard";

const rfidRoutes = (sequelize: any, models: any) => {
  const router = express.Router();

  const rfidCardService = new RFID_CardService(sequelize, models);

  // Generating rfid cards.
  router.post("/set_rfid", handleRFID(sequelize, models));
  return router;
};

export default rfidRoutes;
