import { Op } from "sequelize";

export const getUnassignedStudents = async (models: any) => {
  try {
    const unassignedStudents = await models.Students.findAll({
      where: {
        status: { [Op.ne]: "graduated" }, // Only non-graduated students
      },
      include: [
        {
          model: models.RFID_Cards,
          required: false, // Left join to include students without RFID cards
          as: "rfidCard",
          where: { studentID: null }, // Only those with unassigned RFID cards
        },
      ],
      attributes: ["studentID", "firstName", "lastName"],
    });
    return unassignedStudents;
  } catch (error) {
    console.error("Error fetching unassigned students:", error);
    throw error;
  }
};
