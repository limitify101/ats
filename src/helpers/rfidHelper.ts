export const getUnassignedRFIDs = async (models: any) => {
  try {
    return await models.RFID_Cards.findAll({
      where: { studentID: null },
      attributes: ["id", "rfid_ID"],
    });
  } catch (err: any) {
    console.error("Error fetching unassigned RFIDs", err);
    throw err;
  }
};
export const getStudentWithRFID = async (rfid_id: any, models: any) => {
  try {
    const student = await models.Students.findOne({
      include: [
        {
          model: models.RFID_Cards,
          as: "rfidCard",
          where: { rfid_ID: rfid_id },
          attributes: [], // Only get student details, not card details
        },
      ],
      attributes: ["studentID", "firstName", "lastName"], // Add any other fields you need from Students
    });
    if (!student) {
      console.error("No student found with the specified RFID ID.");
      return null;
    }
    return student;
  } catch (err: any) {
    console.error("Error finding student by RFID:", err);
    throw err;
  }
};
