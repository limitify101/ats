export interface Student {
  studentID: string;
  studentName: string;
  gender: string; // Optional if not always provided
  grade: string;
  contact: string; // Can be an object if multiple contacts are needed
  status: string; // Consider using an enum if there are predefined statuses
}
