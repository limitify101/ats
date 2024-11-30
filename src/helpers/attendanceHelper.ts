export const initializeDailyAttendance = async (models: any, tenantID: any) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    //Fetch all students
    const students = await models.Students.findAll({
      where: {
        status: "active",
        tenantID: tenantID,
      },
      attributes: ["id", "studentID"],
    });
    if (!students || students.length === 0) {
      console.warn("No students registered");
      return;
    }
    //Insert the "pending" status to all students
    const attendanceRecords = students.map((student: any) => ({
      studentID: student.studentID,
      date: today,
      attendance_status: "pending",
      tenantID: tenantID,
    }));
    await models.Attendance.bulkCreate(attendanceRecords, {
      ignoreDuplicates: true,
    });
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
