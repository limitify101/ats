export interface Attendance {
  studentID: string;
  arrivalTime: string;
  attendance_status: string;
  tenantID: string;
  date: string;
}
export interface ScanData {
  rfid_ID: string;
  arrivalTime: Date;
}

export interface ManualData {
  data: any;
}
