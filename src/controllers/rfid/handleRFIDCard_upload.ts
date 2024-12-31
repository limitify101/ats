import csvParser from "csv-parser";
import { Readable } from "stream";
import RFID_CardService from "../../services/RFID_CardService";
import { RFID_CARD } from "../../types/rfid_card.types";

const handleRfidUpload = (
  sequelize: any,
  rfidCardService: RFID_CardService
) => {
  return async (req: any, res: any): Promise<any> => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileBuffer = req.file.buffer; // Access the uploaded file as a buffer
    const transaction: any = await sequelize.transaction();
    const skippedRows: any[] = []; // To track skipped rows due to invalid data
    const results: RFID_CARD[] = [];
    const tenantID = req.tenantId;
    const regex = /^\d{10}$/; // Regex for valid RFID_ID

    try {
      // Wrap the CSV parsing process in a Promise
      await new Promise<void>((resolve, reject) => {
        const stream = Readable.from(fileBuffer.toString());
        stream
          .pipe(csvParser())
          .on("data", (row: any) => {
            try {
              if (!regex.test(row.rfid_ID)) {
                skippedRows.push(row); // Add invalid rows to skippedRows
                return;
              }
              const card: RFID_CARD = { ...row, tenantID };
              results.push(card); // Add valid rows to results
            } catch (error: any) {
              skippedRows.push({ row, error: error.message }); // Track parsing errors
            }
          })
          .on("end", () => {
            resolve(); // Resolve the promise once CSV parsing ends
          })
          .on("error", (err: any) => {
            reject(err); // Reject the promise if there's an error in parsing
          });
      });

      // Upload valid data to the database
      await rfidCardService.uploadCards(results, { transaction });

      // Commit the transaction
      await transaction.commit();

      // Send response with success and skipped rows
      return res.status(201).json({
        success: true,
        msg: "File Uploaded",
        uploadedRows: results.length,
        skippedRows: skippedRows.length,
        skippedData: skippedRows,
      });
    } catch (err: any) {
      // Rollback the transaction in case of error
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        msg: "Error uploading data",
        error:
          "Verify the file format or specific fields and unique constraints",
      });
    }
  };
};

export default handleRfidUpload;
