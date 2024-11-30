import { Op } from "sequelize";

export const getUnassignedStudents = async (models: any, tenantID: any) => {
  try {
    const activeStudents = await models.Students.findAll({
      where: {
        status: { [Op.ne]: "graduated" },
        tenantID: {
          [Op.eq]: tenantID,
        },
      },
      include: [
        {
          model: models.RFID_Cards,
          required: false,
          as: "rfidCard",
        },
      ],
      order: ["grade"],
      attributes: ["studentID", "studentName"],
    });

    // Filter out students already assigned an RFID card
    const unassignedStudents = activeStudents.filter(
      (student: any) => !student.rfidCard
    );

    return { unassignedStudents, activeStudents };
  } catch (error) {
    console.error("Error fetching unassigned students:", error);
    throw error;
  }
};
