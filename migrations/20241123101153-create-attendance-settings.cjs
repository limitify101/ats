"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AttendanceSettings", {
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
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "08:00",
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "17:00",
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
    await queryInterface.dropTable("AttendanceSettings");
  },
};
