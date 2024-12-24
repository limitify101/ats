import { Model, DataTypes } from "sequelize";

interface StaffAttributes {
  id: string;
  tenantID: string;
  staffID: string;
  staffName: string;
  department: string;
  gender: string;
  contact: string;
  status: "active" | "resigned";
}

const initializeStaff = (sequelize: any) => {
  class Staff extends Model<StaffAttributes> implements StaffAttributes {
    id!: string;
    tenantID!: string;
    staffID!: string;
    staffName!: string;
    department!: string;
    gender!: string;
    contact!: string;
    status!: "active" | "resigned";
  }

  Staff.init(
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
      staffID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      staffName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "resigned"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Staff",
      tableName: "Staff",
      timestamps: true,
    }
  );
  return Staff;
};

export default initializeStaff;
