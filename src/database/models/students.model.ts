import { DataTypes, Model, Sequelize } from "sequelize";

class Students extends Model {
  declare id: string; // UUID
  declare studentID: string; // Primary key
  declare firstName: string;
  declare lastName: string;
  declare dateOfBirth: Date;
  declare gender: string;
  declare grade: string;
  declare enrollmentDate: Date;
  declare contact: string;
  declare address?: string; // Optional
  declare emergencyContact?: string; // Optional
  declare status: string;
  declare notes?: string; // Optional
}

const initializeStudentsModel = (sequelize: Sequelize) => {
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
      tableName: "Students",
      timestamps: true,
    }
  );

  return Students;
};

export default initializeStudentsModel;
