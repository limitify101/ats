import { Model, DataTypes } from "sequelize";

interface AttendanceAttributes {
  id: number;
  attendance_status: "present" | "absent" | "late";
  arrivalTime: Date;
  studentID: string;
}

const initializeAttendance = (sequelize: any) => {
  class Attendance
    extends Model<AttendanceAttributes>
    implements AttendanceAttributes
  {
    id!: number;
    attendance_status!: "present" | "absent" | "late";
    arrivalTime!: Date;
    studentID!: string;
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
      tableName: "Attendance",
      timestamps: true,
    }
  );

  return Attendance;
};

export default initializeAttendance;
