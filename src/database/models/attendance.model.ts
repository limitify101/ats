import { DataTypes, Model, Sequelize } from "sequelize";

class Attendance extends Model {
  declare id: number;
  declare attendance_status: "present" | "absent" | "late";
  declare arrivalTime: Date;
  declare studentID: string;
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
      tableName: "Attendance",
      timestamps: true,
    }
  );

  return Attendance;
};

export default initializeAttendanceModel;
