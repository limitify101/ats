import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("RFID_Cards.models", {
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
        references: {
          model: "Students", // Referencing the Students model
          key: "studentID",
        },
        onDelete: "CASCADE",
      },
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("RFID_Cards.models");
  },
};
