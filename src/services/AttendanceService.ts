import { Op, Sequelize } from "sequelize";
import { Attendance } from "../types/attendance.types";
import dayjs from "dayjs";
interface AttendanceConditions {
  month: string; // E.g., "November"
  year: number; // E.g., 2024
}
interface GradeMetadata {
  class: string; // E.g., "P1", "S1"
  totalStudents: number;
  male: number;
  female: number;
  attendances: number;
  late: number;
  absences: number;
}
interface ReportData {
  month: string;
  totalStudents: number;
  totalMales: number;
  totalFemales: number;
  attendances: number;
  lateArrivals: number;
  absences: number;
  metadata: Array<{
    class: string;
    totalStudents: number;
    male: number;
    female: number;
    attendances: number;
    late: number;
    absences: number;
  }>;
}

class AttendanceService {
  model: any;
  constructor(model: any) {
    this.model = model;
  }

  async log(attendanceLog: Attendance, options: { transaction: any }) {
    try {
      const attendance = await this.model.create(attendanceLog, {
        options,
      });
      return attendance;
    } catch (err: any) {
      throw err;
    }
  }

  async uploadLog(
    attendanceLog: Attendance[],
    { transaction }: { transaction: any }
  ) {
    try {
      await this.model.bulkCreate(attendanceLog, {
        transaction, // Pass transaction here
      });
    } catch (err: any) {
      return err;
    }
  }

  async presentCount(tenantID: any) {
    const today = new Date().toISOString().split("T")[0];
    try {
      const presenceCount = await this.model.count({
        where: {
          attendance_status: "present",
          tenantID: tenantID,
          date: {
            [Op.eq]: today,
          },
        },
      });
      return presenceCount;
    } catch (err: any) {
      console.error("Error fetching count of present students:", err);
      throw err;
    }
  }
  async lateCount(tenantID: any) {
    const today = new Date().toISOString().split("T")[0];
    try {
      const lateCount = await this.model.count({
        where: {
          attendance_status: "late",
          tenantID: tenantID,
          date: {
            [Op.eq]: today,
          },
        },
      });
      return lateCount;
    } catch (err: any) {
      console.error("Error fetching count of late students:", err);
      throw err;
    }
  }
  async absentCount(tenantID: any) {
    const today = new Date().toISOString().split("T")[0];
    try {
      const absentCount = await this.model.count({
        where: {
          attendance_status: "absent",
          tenantID: tenantID,
          date: {
            [Op.eq]: today,
          },
        },
      });
      return absentCount;
    } catch (err: any) {
      console.error("Error fetching count of absent students:", err);
      throw err;
    }
  }
  async listAttendance(tenantID: any) {
    try {
      const attendanceLogs = await this.model.findAll({
        attributes: ["studentID", "arrivalTime", "attendance_status"],
        where: {
          tenantID: {
            [Op.eq]: tenantID,
          },
        },
      });
      return attendanceLogs;
    } catch (err: any) {
      console.error("Error fetching attendance Logs:", err);
      throw err;
    }
  }
  async attendancePerClass(tenantID: any, date: any, Students: any) {
    try {
      const attendanceData = await this.model.findAll({
        include: [
          {
            model: Students,
            as: "student",
            attributes: ["studentID", "studentName", "grade"],
          },
        ],
        attributes: ["attendance_status", "arrivalTime", "notes"], // Include attendance-related fields
        where: {
          date: {
            [Op.eq]: date,
          },
        },
        tenantID: {
          [Op.eq]: tenantID,
        },
        raw: true,
        order: [[Sequelize.col("student.studentName"), "ASC"]], // Flatten the result for easier manipulation
      });
      console.log("Attendance per class is :" + attendanceData);
      return attendanceData;
    } catch (err: any) {
      throw err;
    }
  }

  async presenceCountPerClass(tenantID: any, Students: any) {
    const today = new Date().toISOString().split("T")[0];
    try {
      // Fetch all grades for the tenant
      const allGrades = await Students.findAll({
        attributes: ["grade"],
        where: { tenantID },
        group: ["grade"], // Get unique grades
        raw: true,
      });

      // Fetch the count of present/late students grouped by grade
      const presenceCount = await this.model.findAll({
        attributes: [
          [Sequelize.col("student.grade"), "grade"],
          [Sequelize.fn("COUNT", Sequelize.col("Attendance.id")), "count"],
        ],
        where: {
          attendance_status: {
            [Op.in]: ["present", "late"],
          },
          tenantID: tenantID,
          date: {
            [Op.eq]: today,
          },
        },
        include: [
          {
            model: Students,
            as: "student",
            attributes: [],
            required: false, // Ensure grades without attendance records are included
          },
        ],
        group: ["student.grade"],
        raw: true,
      });

      // Map presence count to a dictionary
      const presenceMap = presenceCount.reduce((acc: any, item: any) => {
        acc[item.grade] = parseInt(item.count, 10);
        return acc;
      }, {});

      // Ensure all grades are included, even with 0 count
      const result = allGrades.reduce((acc: any, grade: any) => {
        acc[grade.grade] = presenceMap[grade.grade] || 0; // Default to 0 if no records
        return acc;
      }, {});

      return result;
    } catch (err: any) {
      console.error("Error fetching count of present students per grade:", err);
      throw err;
    }
  }

  async filteredAttendance(conditions: any, Students: any) {
    const whereConditions: any = {};
    if (conditions.date) {
      whereConditions[Op.and] = [
        Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("date")),
          conditions.date
        ),
      ];
    }
    try {
      const attendance = await this.model.findAll({
        where: whereConditions,
        include: [
          {
            model: Students,
            as: "student",
            where: {
              ...(conditions.grade && { grade: conditions.grade }),
            },
            attributes: ["studentID", "studentName", "grade"],
          },
        ],
        attributes: ["arrivalTime", "attendance_status"],
      });
      return attendance;
    } catch (err: any) {
      console.log("Error fetching logs", err);
      throw err;
    }
  }

  async manualAttendance(log: any, tenantID: any, transaction: any) {
    try {
      if (!log || !log.date) {
        throw new Error("Invalid log data: Missing date or log structure.");
      }

      const attendanceUpdates = Object.entries(log)
        .filter(([key]) => key !== "date")
        .flatMap(([_, classData]: any) => {
          if (!classData?.students || !Array.isArray(classData.students)) {
            throw new Error(
              `Invalid class data: Missing or invalid students array for class ${
                classData.className || "unknown"
              }`
            );
          }
          return classData.students.map((student: any) => {
            if (!student.studentID) {
              throw new Error(
                `Invalid student data: Missing id or status for student in class ${classData.className}`
              );
            }
            return {
              studentID: student.studentID,
              date: log.date,
              attendance_status:
                student.status !== "" ? student.status : "pending",
              notes: student.notes !== "N/A" ? student.notes : null,
              tenantID,
            };
          });
        });

      if (!attendanceUpdates.length) {
        throw new Error("No valid attendance records to update.");
      }

      // Perform bulk update
      const updatedAttendance = await Promise.all(
        attendanceUpdates.map(async (update) => {
          // Find if a record already exists for the student, date, and tenantID
          const existingRecord = await this.model.findOne({
            where: {
              studentID: update.studentID,
              date: log.date,
              tenantID: tenantID,
            },
            transaction,
          });

          if (existingRecord) {
            // Update the existing record
            return existingRecord.update(
              {
                attendance_status: update.attendance_status,
                notes: update.notes,
              },
              { transaction }
            );
          } else {
            // Create a new record
            return this.model.create(
              {
                ...update,
                date: log.date,
                tenantID: tenantID,
              },
              { transaction }
            );
          }
        })
      );

      return updatedAttendance;
    } catch (err: any) {
      console.error("Error during manual attendance:", err.message);
      throw err; // Ensure the error propagates to the controller
    }
  }
  async weeklyAttendance(tenantID: any) {
    try {
      const today = new Date();
      const startOfWeek = new Date(
        today.setDate(today.getDate() - (today.getDay() + 6))
      ); //Monday
      const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 4));

      const attendanceData = await this.model.findAll({
        where: {
          date: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
          tenantID: tenantID,
        },
        attributes: ["date", "attendance_status"],
      });
      const summary: any = {};
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(
        (day, i) => {
          const dayDate: any = new Date(startOfWeek);
          dayDate.setDate(startOfWeek.getDate() + i);
          const dayData: any = attendanceData.filter(
            (record: any) =>
              new Date(record.date).toDateString() === dayDate.toDateString()
          );
          summary[day] = {
            present: dayData.filter(
              (record: any) => record.attendance_status === "present"
            ).length,
            late: dayData.filter(
              (record: any) => record.attendance_status === "late"
            ).length,
            absent: dayData.filter(
              (record: any) => record.attendance_status === "absent"
            ).length,
          };
        }
      );

      return summary;
    } catch (err: any) {
      throw err;
    }
  }
  async generateReport(
    conditions: AttendanceConditions,
    Students: any,
    tenantID: any
  ): Promise<ReportData | null> {
    try {
      const { month, year } = conditions;
      if (!month && !year) {
        return null;
      }
      const monthMap: Record<string, number> = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };

      const monthNumber = monthMap[month];
      if (!monthNumber) {
        throw new Error("Invalid month provided.");
      }

      const results = await this.model.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              new Date(year, monthNumber - 1, 1),
              new Date(year, monthNumber, 0, 23, 59, 59),
            ],
          },
          tenantID: tenantID,
        },
        include: [
          {
            model: Students,
            attributes: ["studentID", "grade", "gender"],
            as: "student",
          },
        ],
        raw: true,
      });

      if (results.length === 0) {
        return null;
      }

      // Track unique students by grade and gender
      const uniqueStudentsByGrade: Record<string, Map<string, string>> = {};
      const gradesSummary: Record<string, GradeMetadata> = {};

      // Global gender counters
      let totalMales = 0;
      let totalFemales = 0;

      // Initialize summary counters
      const summary = { attendances: 0, late: 0, absences: 0 };

      for (const record of results) {
        const grade =
          record["student.grade"].match(/^[A-Za-z]+\d+/)?.[0] || "Unknown";
        const studentID = record["student.studentID"];
        const gender = record["student.gender"];
        const status = record.attendance_status;

        // Ensure grade exists in uniqueStudentsByGrade
        if (!uniqueStudentsByGrade[grade]) {
          uniqueStudentsByGrade[grade] = new Map();
        }

        // Add unique students to the grade with their gender
        uniqueStudentsByGrade[grade].set(studentID, gender);

        // Ensure grade exists in gradesSummary
        if (!gradesSummary[grade]) {
          gradesSummary[grade] = {
            class: grade,
            totalStudents: 0,
            male: 0,
            female: 0,
            attendances: 0,
            late: 0,
            absences: 0,
          };
        }

        const gradeData = gradesSummary[grade];

        // Increment attendance counters
        if (status === "present") {
          summary.attendances += 1;
          gradeData.attendances += 1;
        }
        if (status === "late") {
          summary.late += 1;
          gradeData.late += 1;
        }
        if (status === "absent") {
          summary.absences += 1;
          gradeData.absences += 1;
        }
      }

      // Calculate gender counts and total students from unique students
      for (const grade in uniqueStudentsByGrade) {
        const uniqueStudents = uniqueStudentsByGrade[grade];
        gradesSummary[grade].totalStudents = uniqueStudents.size;
        gradesSummary[grade].male = Array.from(uniqueStudents.values()).filter(
          (gender) => gender === "Male"
        ).length;
        gradesSummary[grade].female = Array.from(
          uniqueStudents.values()
        ).filter((gender) => gender === "Female").length;

        // Add to global gender counters
        totalMales += gradesSummary[grade].male;
        totalFemales += gradesSummary[grade].female;
      }

      // Format the metadata
      const metadata = Object.values(gradesSummary);

      // Final report
      const report: ReportData = {
        month,
        totalStudents: Object.values(uniqueStudentsByGrade).reduce(
          (acc, uniqueStudents) => acc + uniqueStudents.size,
          0
        ),
        totalMales, // New field for total males
        totalFemales, // New field for total females
        attendances: summary.attendances,
        lateArrivals: summary.late,
        absences: summary.absences,
        metadata,
      };

      return report;
    } catch (err) {
      throw err;
    }
  }
}

export default AttendanceService;
