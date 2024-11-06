export const extractStudentData = (body: any) => {
  return {
    studentID: body.studentID,
    firstName: body.firstName,
    lastName: body.lastName,
    dateOfBirth: body.dateOfBirth,
    gender: body.gender,
    grade: body.grade,
    enrollmentDate: body.enrollmentDate,
    contact: body.contact,
    address: body.address,
    emergencyContact: body.emergencyContact,
    status: body.status,
    notes: body.notes,
  };
};
