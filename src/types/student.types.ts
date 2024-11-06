export interface Student {
  studentID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender?: string; // Optional if not always provided
  grade: string;
  enrollmentDate: Date;
  contact: string; // Can be an object if multiple contacts are needed
  address: string;
  emergencyContact: string; // Can also be an object for more details
  status: string; // Consider using an enum if there are predefined statuses
  notes?: string; // Optional
}
