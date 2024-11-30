import { Model, DataTypes, Sequelize } from "sequelize";

interface AttendanceAttributes {
  id: number;
  tenantID: string;
  attendance_status: "present" | "absent" | "late" | "pending";
  arrivalTime: Date;
  studentID: string;
  notes: string;
  date: string;
}

const initializeAttendance = (sequelize: any) => {
  class Attendance
    extends Model<AttendanceAttributes>
    implements AttendanceAttributes
  {
    id!: number;
    tenantID!: string;
    attendance_status!: "present" | "absent" | "late" | "pending";
    arrivalTime!: Date;
    studentID!: string;
    notes!: string;
    date!: string;
  }

  Attendance.init(
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
      modelName: "Attendance",
      tableName: "Attendance",
      timestamps: true,
    }
  );

  return Attendance;
};

export default initializeAttendance;
