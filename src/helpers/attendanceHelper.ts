export const initializeDailyAttendance = async (models: any, tenantID: any) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Format today's date (YYYY-MM-DD)

    // Fetch all students
    const students = await models.Students.findAll({
      where: {
        status: "active",
        tenantID: tenantID,
      },
      attributes: ["id", "studentID"],
    });

    // Fetch attendance records for today
    const existingAttendances = await models.Attendance.findAll({
      where: {
        date: today,
        tenantID: tenantID,
      },
      attributes: ["studentID"], // Only need the studentID for comparison
    });

    if (!students || students.length === 0) {
      console.warn("No students registered");
      return;
    }

    // Extract existing student IDs who already have attendance for today
    const existingStudentIDs = new Set(
      existingAttendances.map((attendance: any) => attendance.studentID)
    );

    // Filter out students who already have attendance logged for today
    const studentsToAttend = students.filter(
      (student: any) => !existingStudentIDs.has(student.studentID)
    );

    if (studentsToAttend.length === 0) {
      console.log("All students already have attendance recorded for today.");
      return;
    }

    // Create attendance records for students who don't have attendance logged yet
    const attendanceRecords = studentsToAttend.map((student: any) => ({
      studentID: student.studentID,
      date: today,
      attendance_status: "pending",
      tenantID: tenantID,
    }));

    // Bulk insert attendance records
    await models.Attendance.bulkCreate(attendanceRecords);
    console.log("Daily attendance initialized successfully!");
  } catch (err: any) {
    console.error("Error initializing daily attendance:", err);
  }
};

export const setAbsentForPendingStudents = async (
  Attendance: any,
  tenantID: any
) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Update pending records to absent
    await Attendance.update(
      { attendance_status: "absent" },
      {
        where: {
          date: today,
          attendance_status: "pending",
          tenantID: tenantID,
        },
      }
    );

    console.log("Pending attendances marked as absent!");
  } catch (err) {
    console.error("Error setting absences:", err);
  }
};
