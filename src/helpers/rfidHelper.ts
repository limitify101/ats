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
