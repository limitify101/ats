import initializeStudentsModel from "./students.model";
import initializeRFIDCardsModel from "./rfid_cards.model";
import initializeAttendanceModel from "./attendance.model";

const Models = (sequelize: any) => {
  const Students = initializeStudentsModel(sequelize);
  const RFID_Cards = initializeRFIDCardsModel(sequelize);
  const Attendance = initializeAttendanceModel(sequelize);

  Students.hasOne(RFID_Cards, {
    foreignKey: "studentID",
    as: "rfidCard",
  });
  RFID_Cards.belongsTo(Students, {
    foreignKey: "studentID",
    as: "student",
  });
  Students.hasMany(Attendance);
  // Sync models with the database
  sequelize
    .sync()
    .then(() => console.log("Database in sync mode..."))
    .catch((error: any) => console.error("Error syncing database:", error));

  return { Students, RFID_Cards, Attendance };
};

export default Models;
