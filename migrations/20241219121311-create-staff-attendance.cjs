"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StaffAttendances", {
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
      attendance_status: {
        type: Sequelize.ENUM("present", "absent", "late", "pending"),
        defaultValue: "pending",
        allowNull: false,
      },
      arrivalTime: {
        type: Sequelize.DATE,
      },
      staffID: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Staff",
          key: "staffID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      notes: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
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
    await queryInterface.dropTable("StaffAttendances");
  },
};
