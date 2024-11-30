import express from "express";
import RFID_CardService from "../services/RFID_CardService";
import handleRFID from "../controllers/rfid/handleRFIDCard";
import handleRfidUpload from "../controllers/rfid/handleRFIDCard_upload";
import upload from "../middleware/uploadCSV";
import {
  assignRFIDsToStudents,
  assignToSingleStudent,
} from "../controllers/rfid/assignRFIDtoStudents";
import listRFID from "../controllers/rfid/listRFID";
import {
  countActiveRFID,
  countInactiveRFID,
} from "../controllers/rfid/countRFIDs";
import extractTenantId from "../middleware/extractTenantID";
import {
  activateRFIDCard,
  deactivateRFIDCard,
} from "../controllers/rfid/activationRFIDCard";
import deleteRFIDCard from "../controllers/rfid/deleteRFIDCard";

const rfidRoutes = (sequelize: any, models: any) => {
  const router = express.Router();

  const rfidCardService = new RFID_CardService(models);

  // Generating rfid cards.
  router.post("/set", extractTenantId, handleRFID(sequelize, rfidCardService));
  router.post(
    "/upload",
    upload.single("csv"),
    extractTenantId,
    handleRfidUpload(sequelize, rfidCardService)
  );
  router.post(
    "/assign",
    extractTenantId,
    assignRFIDsToStudents(sequelize, models)
  );
  router.post(
    "/assign-single/:ID",
    extractTenantId,
    assignToSingleStudent(sequelize, models)
  );
  router.get("/list", extractTenantId, listRFID(sequelize, rfidCardService));
  router.get(
    "/count-active",
    extractTenantId,
    countActiveRFID(sequelize, rfidCardService)
  );
  router.get(
    "/count-inactive",
    extractTenantId,
    countInactiveRFID(sequelize, rfidCardService)
  );
  router.post(
    "/deactivate/:id",
    extractTenantId,
    deactivateRFIDCard(sequelize, rfidCardService)
  );
  router.post(
    "/activate/:id",
    extractTenantId,
    activateRFIDCard(sequelize, rfidCardService)
  );
  router.delete(
    "/delete/:id",
    extractTenantId,
    deleteRFIDCard(sequelize, rfidCardService)
  );
  return router;
};

export default rfidRoutes;
