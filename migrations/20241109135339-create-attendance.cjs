"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Attendance", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenantID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      studentID: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Students",
          key: "studentID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      attendance_status: {
        type: Sequelize.ENUM("present", "absent", "late", "pending"),
        defaultValue: "absent",
        allowNull: false,
      },
      arrivalTime: {
        type: Sequelize.DATE,
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
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });
    await queryInterface.addConstraint("Attendance", {
      fields: ["studentID", "date"],
      type: "unique",
      name: "unique_attendance_per_student_per_day", // Custom constraint name
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Attendance",
      "unique_attendance_per_student_per_day"
    );
    await queryInterface.dropTable("Attendance");
  },
};
