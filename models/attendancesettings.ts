import { Model, DataTypes } from "sequelize";

interface AttendanceSettingsAttributes {
  id: number;
  tenantID: string;
  startTime: string;
  endTime: string;
}

const initializeAttendanceSettings = (sequelize: any) => {
  class AttendanceSettings
    extends Model<AttendanceSettingsAttributes>
    implements AttendanceSettingsAttributes
  {
    id!: number;
    tenantID!: string;
    startTime!: string;
    endTime!: string;
  }

  AttendanceSettings.init(
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
        unique: true,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: "08:00",
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: "17:00",
      },
    },
    {
      sequelize,
      modelName: "AttendanceSettings",
      tableName: "AttendanceSettings",
      timestamps: true,
    }
  );

  return AttendanceSettings;
};

export default initializeAttendanceSettings;
