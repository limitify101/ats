import express from "express";
import StudentService from "../services/StudentService";
import handleCreateStudent from "../controllers/handleCreateStudent";
import upload from "../middleware/uploadCSV";
import handleUpload from "../controllers/handleCreateStudent_upload";
import { getUnassignedStudents } from "../helpers/studentsHelper";

const studentRoutes = (sequelize: any, Students: any, RFID_Cards: any) => {
  const router = express.Router();

  const studentService = new StudentService(Students);

  router.post("/create", handleCreateStudent(sequelize, studentService));
  router.post(
    "/upload",
    upload.single("csv"),
    handleUpload(sequelize, studentService)
  );

  //Get students with no RFIDs.
  router.get("/unassigned-students", async (req: any, res: any) => {
    try {
      const unassignedStudents = await getUnassignedStudents({
        Students,
        RFID_Cards,
      });
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
