"use strict";
import { Model } from "sequelize";
interface RFID_CardsAttributes {
  rfid_ID: string;
  id: string;
  activated: boolean;
  studentID?: string | null;
}
module.exports = (sequelize: any, DataTypes: any) => {
  class RFID_Cards
    extends Model<RFID_CardsAttributes>
    implements RFID_CardsAttributes
  {
    id!: string;
    rfid_ID!: string;
    activated!: boolean;
    studentID?: string | null;

    static associate(models: any) {
      // define association here
      RFID_Cards.belongsTo(models.Students, {
        foreignKey: "studentID",
        as: "student",
      });
    }
  }
  RFID_Cards.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      rfid_ID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      studentID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "Students",
          key: "studentID",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "RFID_Cards",
    }
  );
  return RFID_Cards;
};
