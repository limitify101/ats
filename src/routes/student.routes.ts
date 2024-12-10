import express from "express";
import StudentService from "../services/StudentService";
import handleCreateStudent from "../controllers/students/handleCreateStudent";
import upload from "../middleware/uploadCSV";
import handleUpload from "../controllers/students/handleCreateStudent_upload";
import { getUnassignedStudents } from "../helpers/studentsHelper";
import listStudents from "../controllers/students/listStudents";
import extractTenantId from "../middleware/extractTenantID";
import listClasses from "../controllers/students/listClasses";
import handleDeleteStudent from "../controllers/students/deleteStudent";
import viewStudent from "../controllers/students/viewStudent";

const studentRoutes = (
  sequelize: any,
  Students: any,
  RFID_Cards: any,
  Attendance: any
) => {
  const router = express.Router();

  const studentService = new StudentService(Students);

  router.post(
    "/create",
    extractTenantId,
    handleCreateStudent(sequelize, studentService)
  );
  router.post(
    "/upload",
    upload.single("csv"),
    extractTenantId,
    handleUpload(sequelize, studentService)
  );
  router.delete(
    "/delete/:ID",
    extractTenantId,
    handleDeleteStudent(sequelize, studentService, RFID_Cards)
  );
  router.get(
    "/search/:ID",
    extractTenantId,
    viewStudent(sequelize, studentService, Attendance, RFID_Cards)
  );
  router.get(
    "/list",
    extractTenantId,
    listStudents(sequelize, studentService, RFID_Cards)
  );
  router.get(
    "/list-classes",
    extractTenantId,
    listClasses(sequelize, studentService)
  );
  //Get students with no RFIDs.
  router.get(
    "/unassigned-students",
    extractTenantId,
    async (req: any, res: any) => {
      try {
        const { unassignedStudents } = await getUnassignedStudents(
          {
            Students,
            RFID_Cards,
          },
          req.tenantId
        );
        res.status(200).json({
          success: true,
          unassignedStudents,
        });
      } catch (err: any) {
        res.status(500).json({
          success: false,
          message: "Error retrieving unassigned students.",
          error: err.message,
        });
      }
    }
  );
  router.get(
    "/active-students",
    extractTenantId,
    async (req: any, res: any) => {
      try {
        const { activeStudents } = await getUnassignedStudents(
          {
            Students,
            RFID_Cards,
          },
          req.tenantId
        );
        return res.status(200).json({
          success: true,
          activeStudents,
        });
      } catch (err: any) {
        return res.status(500).json({
          success: false,
          message: "Error retrieving active students.",
          error: err.message,
        });
      }
    }
  );
  return router;
};

export default studentRoutes;
