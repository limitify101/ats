import csvParser from "csv-parser";
import StudentService from "../../services/StudentService";
import fs from "fs";
import { Student } from "../../types/student.types";
import { extractStudentData } from "../utils/extractStudentData";

const handleUpload = (sequelize: any, studentService: StudentService) => {
  return async (req: any, res: any): Promise<any> => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const filePath = req.file.path;
    const transaction: any = await sequelize.transaction();
    const skippedRows: any[] = []; // To track skipped rows due to invalid data
    const results: Student[] = []; // To track successfully parsed rows

    try {
      // Wrap the CSV parsing process in a Promise
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on("data", (row: any) => {
            // Parse the row into a Student object and push to results
            const student: Student = extractStudentData(
              {
                ...row,
              },
              req.tenantId
            );

            results.push(student); // Add valid student data to results
          })
          .on("end", () => {
            resolve(); // Resolve the promise once CSV parsing ends
          })
          .on("error", (err: any) => {
            reject(err); // Reject the promise if there's an error in parsing
          });
      });

      // After CSV parsing is complete, upload the valid data
      await studentService.uploadStudents(results, { transaction });

      // Commit the transaction after all data is processed
      await transaction.commit();

      // Send response with success and details on skipped rows
      return res.status(201).json({
        success: true,
        msg: "File Uploaded!",
        uploadedRows: results.length,
        skippedRows: skippedRows.length,
        skippedData: skippedRows, // Optionally send skipped rows in the response for review
      });
    } catch (err: any) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        msg: "Error inserting data into database",
        error: "Verify the file format or specific fields", // Return the specific error message
      });
    }
  };
};

export default handleUpload;