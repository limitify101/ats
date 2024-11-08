import express from "express";
import StudentService from "../services/StudentService";
import RFID_CardService from "../services/RFID_CardService";
import handleCreateStudent from "../controllers/handleCreateStudent";
import upload from "../middleware/uploadCSV";
import handleUpload from "../controllers/handleCreateStudent_upload";
import { getUnassignedStudents } from "../helpers/studentsHelper";

const studentRoutes = (sequelize: any, models: any) => {
  const router = express.Router();

  const studentService = new StudentService(sequelize, models);
  const rfidCardService = new RFID_CardService(sequelize, models);
  router.post(
    "/create",
    handleCreateStudent(sequelize, studentService, rfidCardService)
  );
  router.post(
    "/upload",
    upload.single("csv"),
    handleUpload(sequelize, studentService)
  );

  //Get students with no RFIDs.
  router.get("/unassigned-students", async (req: any, res: any) => {
    try {
      const unassignedStudents = await getUnassignedStudents(sequelize);
      res.json({
        success: true,
        data: unassignedStudents,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Error retrieving unassigned students.",
        error: err.message,
      });
    }
  });
  return router;
};

export default studentRoutes;
