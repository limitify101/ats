import path from "path";
import process from "process";
import { Sequelize } from "sequelize";
import initializeStudents from "./students";
import initializeRFIDCards from "./rfidCards";
import initializeAttendance from "./attendance";
import initializeAttendanceSettings from "./attendancesettings";
import initializeStaff from "./staff";
import initializeStaffCards from "./staffCards";
import initializeStaffAttendance from "./staffAttendance";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const env = process.env.NODE_ENV || "development";

const config = (await import(path.join(__dirname, "../config/config.js")))
  .default[env];

const db: any = {};

let sequelize: Sequelize;
//Add config.url in testing environment
sequelize = new Sequelize(
  // config.database,
  // config.username,
  // config.password,
  config.url,
  config
);

/* Students-Only Related Models*/
const Students = initializeStudents(sequelize);
const RFID_Cards = initializeRFIDCards(sequelize);
const Attendance = initializeAttendance(sequelize);

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

/* Staff-Only Related Model */
const Staff = initializeStaff(sequelize);
const StaffCards = initializeStaffCards(sequelize);
const StaffAttendances = initializeStaffAttendance(sequelize);

Staff.hasMany(StaffAttendances, {
  foreignKey: "staffID",
  sourceKey: "staffID",
});
Staff.hasOne(StaffCards, {
  foreignKey: "staffID",
  sourceKey: "staffID",
});
StaffCards.belongsTo(Staff, {
  foreignKey: "staffID",
  targetKey: "staffID",
});
StaffAttendances.belongsTo(Staff, {
  foreignKey: "staffID",
  targetKey: "staffID",
});

/* Client-Only Related Model */
const AttendanceSettings = initializeAttendanceSettings(sequelize);

AttendanceSettings.hasMany(Attendance, {
  foreignKey: "tenantID",
  sourceKey: "tenantID",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Students = Students;
db.RFID_Cards = RFID_Cards;
db.Attendance = Attendance;
db.Staff = Staff;
db.StaffCards = StaffCards;
db.StaffAttendances = StaffAttendances;
db.AttendanceSettings = AttendanceSettings;

export default db;
