"use strict";
import { Model } from "sequelize";
interface StudentsAttributes {
  id: string; // UUID
  studentID: string; // Primary key
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  grade: string;
  enrollmentDate: Date;
  contact: string;
  address?: string; // Optional
  emergencyContact?: string; // Optional
  status: "active" | "graduated";
  notes?: string;
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Students
    extends Model<StudentsAttributes>
    implements StudentsAttributes
  {
    id!: string; // UUID
    studentID!: string; // Primary key
    firstName!: string;
    lastName!: string;
    dateOfBirth!: Date;
    gender!: string;
    grade!: string;
    enrollmentDate!: Date;
    contact!: string;
    address?: string; // Optional
    emergencyContact?: string; // Optional
    status!: "active" | "graduated";
    notes?: string;

    static associate(models: any) {
      // define association here
      Students.hasOne(models.RFID_Cards, {
        foreignKey: "studentID",
        sourceKey: "studentID",
        as: "rfidCard",
      });
      Students.hasMany(models.Attendance, {
        foreignKey: "studentID",
        as: "attendance",
      });
    }
  }
  Students.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
      },
      emergencyContact: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Students",
    }
  );
  return Students;
};
