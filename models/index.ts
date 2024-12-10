import path from "path";
import process from "process";
import { Sequelize } from "sequelize";
import initializeStudents from "./students";
import initializeRFIDCards from "./rfidCards";
import initializeAttendance from "./attendance";
import initializeAttendanceSettings from "./attendancesettings";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const env = process.env.NODE_ENV || "development";

const config = (await import(path.join(__dirname, "../config/config.js")))
  .default[env];

const db: any = {};

let sequelize: Sequelize;
sequelize = new Sequelize(config.url, config);
const Students = initializeStudents(sequelize);
const RFID_Cards = initializeRFIDCards(sequelize);
const Attendance = initializeAttendance(sequelize);
const AttendanceSettings = initializeAttendanceSettings(sequelize);

Students.hasOne(RFID_Cards, {
  foreignKey: "studentID",
  sourceKey: "studentID",
  as: "rfidCard",
});
Students.hasMany(Attendance, {
  foreignKey: "studentID",
  sourceKey: "studentID",
  as: "attendance",
});
RFID_Cards.belongsTo(Students, {
  foreignKey: "studentID",
  targetKey: "studentID",
  as: "student",
});
Attendance.belongsTo(Students, {
  foreignKey: "studentID",
  targetKey: "studentID",
  as: "student",
});
AttendanceSettings.hasMany(Attendance, {
  foreignKey: "tenantID",
  sourceKey: "tenantID",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Students = Students;
db.RFID_Cards = RFID_Cards;
db.Attendance = Attendance;
db.AttendanceSettings = AttendanceSettings;

export default db;
