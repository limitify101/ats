import { getUnassignedRFIDs } from "../../helpers/rfidHelper";
import { getUnassignedStudents } from "../../helpers/studentsHelper";

export const assignRFIDsToStudents = (sequelize: any, models: any) => {
  return async (req: any, res: any): Promise<any> => {
    const transaction: any = await sequelize.transaction();
    const tenantID = req.tenantId;
    try {
      const { unassignedStudents } = await getUnassignedStudents(
        models,
        tenantID
      );
      const unassignedRFIDs = await getUnassignedRFIDs(models, tenantID);

      if (unassignedRFIDs.length === 0) {
        await transaction.rollback();
        return res.status(202).json({
          success: false,
          msg: "No available cards to assign",
        });
      }
      if (unassignedStudents.length === 0) {
        await transaction.rollback();
        return res.status(202).json({
          success: true,
          msg: "All active students are assigned with a card.",
        });
        return;
      }
      //Shuffle RFIDs to ensure randomization.
      for (let i = unassignedRFIDs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unassignedRFIDs[i], unassignedRFIDs[j]] = [
          unassignedRFIDs[j],
          unassignedRFIDs[i],
        ];
      }

      for (
        let i = 0;
        i < unassignedStudents.length && i < unassignedRFIDs.length;
        i++
      ) {
        const student = unassignedStudents[i];
        const rfid = unassignedRFIDs[i];

        // Assign RFID to student and update RFID card's student_id
        try {
          if (student.studentID) {
            await models.RFID_Cards.update(
              { studentID: student.studentID, activated: true },
              { where: { id: rfid.id } }
            );
          }
        } catch (error) {
          console.error("Error updating card:", error);
        }
      }
      await transaction.commit();
      return res.status(201).json({
        success: true,
        msg: "Successfully assigned cards to students",
      });
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error assigning cards:", err);
      return res.status(500).json({
        success: false,
        message: "Error assigning cards",
        error: err.message,
      });
    }
  };
};

export const assignToSingleStudent = (sequelize: any, models: any) => {
  return async (req: any, res: any): Promise<any> => {
    const transaction: any = await sequelize.transaction();
    const tenantID = req.tenantId;
    try {
      const unassignedRFIDs = await getUnassignedRFIDs(models, tenantID);

      if (unassignedRFIDs.length === 0) {
        await transaction.rollback();
        return res.status(202).json({
          success: false,
          msg: "No available cards to assign",
        });
      }

      const { ID } = req.params;
      const rfid = unassignedRFIDs[0];

      // Assign RFID to student and update RFID card's student_id
      try {
        if (ID) {
          await models.RFID_Cards.update(
            { studentID: ID, activated: true },
            { where: { id: rfid.id, tenantID: tenantID } }
          );
        }
      } catch (error) {
        console.error("Error updating card:", error);
      }

      await transaction.commit();
      return res.status(201).json({
        success: true,
        msg: "Successfully assigned cards to student",
      });
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error assigning card:", err);
      return res.status(500).json({
        success: false,
        message: "Error assigning card",
        error: err.message,
      });
    }
  };
};
