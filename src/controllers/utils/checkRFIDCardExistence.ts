import RFID_CardService from "../../services/RFID_CardService";

export const checkRFIDCardExistence = async (
  rfidCardService: RFID_CardService,
  rfid_ID: string,
  tenantId: string
) => {
  const existingCard = await rfidCardService.findCardById(rfid_ID,tenantId);
  return existingCard;
};
