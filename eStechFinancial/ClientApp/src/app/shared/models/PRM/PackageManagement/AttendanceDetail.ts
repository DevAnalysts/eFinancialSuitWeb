export class AttendanceDetail {
  constructor(
    public attendanceDetailId: number,   
    public attendanceId: number,   
    public attendanceDate: any,
    public displayAttendanceDate: any,
    public dayCheckIn: any,
    public dayCheckOut: any,
    public hours: number,
    public minutes: number,    
    public present: any = false,
  ) { }
}
