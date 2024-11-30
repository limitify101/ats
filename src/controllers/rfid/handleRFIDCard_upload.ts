import csvParser from "csv-parser";
import RFID_CardService from "../../services/RFID_CardService";
import { RFID_CARD } from "../../types/rfid_card.types";
import fs from "fs";

const handleRfidUpload = (
  sequelize: any,
  rfidCardService: RFID_CardService
) => {
  return async (req: any, res: any): Promise<any> => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const filePath = req.file.path;
    const transaction: any = await sequelize.transaction();
    const skippedRows: any[] = []; //To track skipped rows due to invalid data.
    const results: RFID_CARD[] = [];
    const tenantID = req.tenantId;
    const regex = /^\d{10}$/;
    try {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on("data", async (row: any) => {
            if (!regex.test(row.rfid_ID)) {
              skippedRows.push(row);
              return;
            }
            const card: RFID_CARD = { ...row, tenantID };
            results.push(card);
          })
          .on("end", () => {
            resolve();
          })
          .on("error", (err: any) => {
            reject(err);
          });
      });

      await rfidCardService.uploadCards(results, { transaction });

      await transaction.commit();

      return res.status(201).json({
        success: true,
        msg: "File Uploaded",
        uploadedRows: results.length,
        skippedRows: skippedRows.length,
        skippedData: skippedRows,
      });
    } catch (err: any) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        msg: "Error uploading data",
        error: err.errors[0].message,
      });
    }
  };
};

export default handleRfidUpload;
