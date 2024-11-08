import { DataTypes, Model, Sequelize } from "sequelize";

class RFID_Cards extends Model {
  declare id: string;
  declare rfid_ID: string;
  declare activated: boolean;
  declare studentID?: string | null; // Foreign key
}

const initializeRFIDCardsModel = (sequelize: Sequelize) => {
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
      tableName: "RFID_Cards",
      timestamps: true,
    }
  );

  return RFID_Cards;
};

export default initializeRFIDCardsModel;
