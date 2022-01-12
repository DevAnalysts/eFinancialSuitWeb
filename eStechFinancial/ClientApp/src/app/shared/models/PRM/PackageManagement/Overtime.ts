import { overtimeDetails } from './overtimeDetails';
export class overtime {
  constructor(
    public overtimeId: number,
    public emP_CODE: number,
    public officE_CODE: number,
    public overtimeDate: any,
    public totalHours: any,
    public totalMinutes: any,
    public totalOvertime: any,
    public totalSpecial: any,
    public totalHoliday: any,
    public Status: any = true,
    public overtimeDetails: overtimeDetails[]

  ) { }
}
