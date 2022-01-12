export class overtimeDetails {
  constructor(
    public overtimeDetailId: any,   
    public overtimeId: any,   
    public Employee: any,    
    public overtimeDate: any,
    public hours: any,
    public minutes: any,
    public overtime: any,
    public special: any,
    public holiday: any,
    public present: any = false,
  ) { }
}
