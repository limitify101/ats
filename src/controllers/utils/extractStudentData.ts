export const extractStudentData = (body: any, tenantId: any) => {
  return {
    tenantID: tenantId,
    studentID: body.studentID,
    studentName: body.studentName,
    gender: body.gender,
    grade: body.grade,
    contact: body.contact,
    status: body.status,
  };
};
