import { Model, DataTypes } from "sequelize";

interface StudentsAttributes {
  id: string;
  tenantID: string;
  studentID: string;
  studentName: string;
  gender: string;
  grade: string;
  contact: string;
  status: "active" | "graduated";
}

const initializeStudents = (sequelize: any) => {
  class Students
    extends Model<StudentsAttributes>
    implements StudentsAttributes
  {
    id!: string;
    tenantID!: string;
    studentID!: string;
    studentName!: string;
    gender!: string;
    grade!: string;
    contact!: string;
    status!: "active" | "graduated";
  }

  Students.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tenantID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      studentID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      studentName: {
        type: DataTypes.STRING,
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
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "graduated", "expelled"),
        allowNull: false,
        defaultValue: "active",
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
