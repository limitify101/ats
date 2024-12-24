"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StaffCards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tenantID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      card_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      staffID: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        references: {
          model: "Staff", // Ensure this matches the actual model name
          key: "staffID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("StaffCards");
  },
};
