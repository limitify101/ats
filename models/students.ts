import { Model, DataTypes } from "sequelize";

interface StudentsAttributes {
  id: string;
  studentID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  grade: string;
  enrollmentDate: Date;
  contact: string;
  address?: string;
  emergencyContact?: string;
  status: "active" | "graduated";
  notes?: string;
}

const initializeStudents = (sequelize: any) => {
  class Students
    extends Model<StudentsAttributes>
    implements StudentsAttributes
  {
    id!: string;
    studentID!: string;
    firstName!: string;
    lastName!: string;
    dateOfBirth!: Date;
    gender!: string;
    grade!: string;
    enrollmentDate!: Date;
    contact!: string;
    address?: string;
    emergencyContact?: string;
    status!: "active" | "graduated";
    notes?: string;
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
        type: DataTypes.ENUM("active", "graduated", "expelled"),
        allowNull: false,
        defaultValue: "active",
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Students",
      timestamps: true,
    }
  );

  return Students;
};

export default initializeStudents;
