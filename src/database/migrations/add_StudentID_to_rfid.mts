import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn("RFID_Cards", "studentID", {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: "Students",
        key: "studentID",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.changeColumn("RFID_Cards", "studentID", {
      type: DataTypes.STRING,
      allowNull: false, // Rollback to NOT NULL if necessary
    });
  },
};
