import { PackageAllowance } from './PackageAllowance';
export class SalaryPackage {
  constructor(
    public packagE_ID: any,
    public emP_ID: any,
    public grosS_SALARY: any,
    public packagE_AMOUNT: any,
    public effecT_from: any,
    public remarks: any,
    public created_By: any,
    public userSessionID: any,
    public hourlyRate: any,
    public specialRate: any,
    public holidayRate: any,
    public dailyWorkingHours: any,
    public prM_PACKAGEALLOWANCE: PackageAllowance[],

  ) { }
}
