import { RFID_CARD } from "../types/rfid_card.types";
import Sequelize from "sequelize";
const { Op } = Sequelize;

class RFID_CardService {
  models: any;

  constructor(models: any) {
    this.models = models;
  }

  async createCard(
    rfid: RFID_CARD,
    studentID: string | null | undefined,
    p0: { transaction: any }
  ) {
    try {
      const card = await this.models.RFID_Cards.create({ ...rfid, studentID });
      return card;
    } catch (err: any) {
      console.log(err);
      return err;
    }
  }
  async uploadCards(data: RFID_CARD[], p0: { transaction: any }) {
    try {
      await this.models.RFID_Cards.bulkCreate(data, {
        transaction: p0.transaction,
        validate: true,
      });
    } catch (err: any) {
      // Handle specific Sequelize errors
      if (err instanceof Sequelize.UniqueConstraintError) {
        throw new Error(
          "Unique constraint violation: " +
            err.errors.map((e: any) => e.message).join(", ")
        );
      } else {
        // Rethrow any other errors
        throw err;
      }
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
