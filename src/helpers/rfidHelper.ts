import { Op } from "sequelize";

export const getUnassignedRFIDs = async (models: any, tenantID: any) => {
  try {
    return await models.RFID_Cards.findAll({
      where: { studentID: null, tenantID: { [Op.eq]: tenantID } },

      attributes: ["id", "rfid_ID"],
    });
  } catch (err: any) {
    console.error("Error fetching unassigned cards", err);
    throw err;
  }
};
export const getStudentWithRFID = async (
  rfid_id: any,
  models: any,
  tenantID: any
) => {
  try {
    const student = await models.Students.findOne({
      include: [
        {
          model: models.RFID_Cards,
          as: "rfidCard",
          where: {
            rfid_ID: rfid_id,
            activated: true,
            tenantID: { [Op.eq]: tenantID },
          },
          attributes: [], // Only get student details, not card details
        },
      ],
      attributes: ["studentID", "studentName"], // Add any other fields you need from Students
    });
    if (!student) {
      console.error("No student found with the specified card.");
      return null;
    }
    return student;
  } catch (err: any) {
    console.error("Error finding student by card:", err);
    throw err;
  }
};
