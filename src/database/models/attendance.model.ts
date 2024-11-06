import { DataTypes, Model, Sequelize } from "sequelize";

class Attendance extends Model {
  public id!: number;
  public attendance_status!: "present" | "absent" | "late";
  public attendanceTime!: string;
}

const initializeAttendanceModel = (sequelize: Sequelize) => {
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
      attendanceTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Attendance",
      timestamps: true,
    }
  );

  return Attendance;
};

export default initializeAttendanceModel;
