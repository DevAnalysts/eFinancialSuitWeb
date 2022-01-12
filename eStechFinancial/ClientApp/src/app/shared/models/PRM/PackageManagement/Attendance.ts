import { AttendanceDetail } from './AttendanceDetail';
export class Attendance {
  constructor(
    public attendanceId: number,
    public emP_CODE: number,
    public officE_CODE: number,
    public attendanceDate: any,
    public totalHours: number,
    public totalMinutes: number,        
    public status: any = true,
    public aGUID: any,
    //public AttendanceDetail: AttendanceDetail[]

  ) { }
}
