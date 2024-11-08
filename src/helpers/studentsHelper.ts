export const getUnassignedStudents = async (sequelize: any) => {
  try {
    const unassignedStudents = await sequelize.query(
      `
        SELECT "Students"."studentID", "Students"."firstName", "Students"."lastName"
        FROM "Students"
        LEFT JOIN "RFID_Cards" ON "Students"."studentID" = "RFID_Cards"."studentID"
        WHERE "RFID_Cards"."studentID" IS NULL;
        `,
      { type: sequelize.QueryTypes.SELECT }
    );
    return unassignedStudents;
  } catch (err: any) {
    console.error("Error fetching unassigned students", err);
    throw err;
  }
};
