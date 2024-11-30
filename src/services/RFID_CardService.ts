import { RFID_CARD } from "../types/rfid_card.types";
import Sequelize, { where } from "sequelize";
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
  async uploadCards(data: any, p0: { transaction: any }) {
    try {
      await this.models.RFID_Cards.bulkCreate(data, {
        transaction: p0.transaction,
        validate: true,
      });
    } catch (err: any) {
      throw err;
    }
  }
  async listAllRFID(tenantID: any) {
    try {
      const rfid = await this.models.RFID_Cards.findAll({
        attributes: [
          "rfid_ID",
          [Sequelize.col("student.studentName"), "assignedTo"],
          "activated",
        ],
        where: {
          tenantID: {
            [Op.eq]: tenantID,
          },
        },
        include: [
          {
            model: this.models.Students,
            as: "student",
            attributes: ["grade"],
          },
        ],
        order: [
          [Sequelize.col("student.grade"), "ASC"],
          ["rfid_ID", "ASC"],
        ],
      });

      return rfid;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }
  async countActiveCards(tenantID: any) {
    try {
      const active = await this.models.RFID_Cards.count({
        where: {
          activated: {
            [Op.eq]: "true",
          },
          tenantID: {
            [Op.eq]: tenantID,
          },
        },
      });
      return active;
    } catch (err: any) {
      return err;
    }
  }

  async countInactiveCards(tenantID: any) {
    try {
      const inactive = await this.models.RFID_Cards.count({
        where: {
          activated: {
            [Op.eq]: "false",
          },
          tenantID: {
            [Op.eq]: tenantID,
          },
        },
      });
      return inactive;
    } catch (err: any) {
      return err;
    }
  }

  async findCardById(rfid_ID: string, tenantId: any) {
    try {
      const result = await this.models.RFID_Cards.findAll({
        where: {
          rfid_ID: {
            [Op.eq]: rfid_ID,
          },
          tenantID: {
            [Op.eq]: tenantId,
          },
        },
      });
      return result[0];
    } catch (err: any) {
      return err;
    }
  }
  async deactivateCard(rfid_ID: string, tenantId: any, transaction: any) {
    try {
      const result = await this.models.RFID_Cards.update(
        { activated: false },
        {
          where: {
            rfid_ID: rfid_ID,
            tenantID: tenantId,
          },
        },
        transaction
      );
      return result;
    } catch (err: any) {
      return err;
    }
  }
  async activateCard(rfid_ID: string, tenantId: any, transaction: any) {
    try {
      const result = await this.models.RFID_Cards.update(
        { activated: true },
        {
          where: {
            rfid_ID: rfid_ID,
            tenantID: tenantId,
          },
        },
        transaction
      );
      return result;
    } catch (err: any) {
      return err;
    }
  }
  async deleteRFIDCard(rfid_ID: string, tenantID: any, transaction: any) {
    try {
      const response = await this.models.RFID_Cards.destroy({
        where: {
          rfid_ID: rfid_ID,
          tenantID: tenantID,
        },
        transaction,
      });
      return response;
    } catch (err: any) {
      return err;
    }
  }
}

export default RFID_CardService;
