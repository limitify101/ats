import { Model, DataTypes, Sequelize } from "sequelize";

interface StaffAttributes {
  id: number;
  tenantID: string;
  attendance_status: "present" | "absent" | "late" | "pending";
  arrivalTime: Date;
  staffID: string;
  notes: string;
  date: string;
}

const initializeStaffAttendance = (sequelize: any) => {
  class StaffAttendances
    extends Model<StaffAttributes>
    implements StaffAttributes
  {
    id!: number;
    tenantID!: string;
    attendance_status!: "present" | "absent" | "late" | "pending";
    arrivalTime!: Date;
    staffID!: string;
    notes!: string;
    date!: string;
  }

  StaffAttendances.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenantID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      attendance_status: {
        type: DataTypes.ENUM("present", "absent", "late", "pending"),
        defaultValue: "pending",
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.DATE,
      },
      staffID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Staff",
          key: "staffID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      notes: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    },
    {
      sequelize,
      modelName: "StaffAttendances",
      tableName: "StaffAttendances",
      timestamps: true,
    }
  );

  return StaffAttendances;
};

export default initializeStaffAttendance;
