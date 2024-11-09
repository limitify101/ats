"use strict";
import { Model } from "sequelize";
interface AttendanceAttributes {
  id: number;
  attendance_status: "present" | "absent" | "late";
  arrivalTime: Date;
  studentID: string;
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Attendance
    extends Model<AttendanceAttributes>
    implements AttendanceAttributes
  {
    id!: number;
    attendance_status!: "present" | "absent" | "late";
    arrivalTime!: Date;
    studentID!: string;

    static associate(models: any) {
      // define association here
    }
  }
  Attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      attendance_status: {
        type: DataTypes.ENUM("present", "absent", "late"),
        defaultValue: "absent",
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      studentID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Students",
          key: "studentID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
