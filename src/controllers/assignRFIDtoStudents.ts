import { getUnassignedRFIDs } from "../helpers/rfidHelper";
import { getUnassignedStudents } from "../helpers/studentsHelper";

const assignRFIDsToStudents = async (sequelize: any, models: any) => {
  const transaction: any = await sequelize.transaction();
  try {
    const unassignedStudents = await getUnassignedStudents(sequelize);
    const unassignedRFIDs = await getUnassignedRFIDs(models);

    if (unassignedRFIDs.length === 0) {
      await transaction.rollback();
      console.warn("No available RFIDs to assign.");
      return;
    }
    if (unassignedStudents.length === 0) {
      await transaction.rollback();
      console.info("All students are assigned with an RFID Card.");
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
          await models.Students.update(
            { status: "graduated" }, // or any other field that may be updated
            {
              where: { studentID: models.Students.studentID },
              individualHooks: true, // Ensure that the hook runs for each row if updating multiple
              models: models.RFID_Cards, // Pass models to options for access in the hook
            }
          );
        }
      } catch (error) {
        console.error("Error updating RFID card:", error);
      }
    }
    console.log("RFID cards updated successfully");
    await transaction.commit();
  } catch (err: any) {
    await transaction.rollback();
  }
};

export default assignRFIDsToStudents;
