import { RFID_CARD } from "../types/rfid_card.types";
import Sequelize from "sequelize";
const { Op } = Sequelize;

class RFID_CardService {
  models: any;

  constructor(sequelize: any, models: any) {
    this.models = models;
  }

  async createCard(
    rfid: RFID_CARD,
    studentID: string,
    p0: { transaction: any }
  ) {
    try {
      const card = await this.models.RFID_Cards.create({ ...rfid, studentID });
      return card;
    } catch (err: any) {
      return err;
    }
  }
  async findCardById(rfid_ID: string) {
    try {
      const result = await this.models.RFID_Cards.findAll({
        where: {
          rfid_ID: {
            [Op.eq]: rfid_ID,
          },
        },
      });
      return result[0];
    } catch (err: any) {
      return err;
    }
  }
}

export default RFID_CardService;
