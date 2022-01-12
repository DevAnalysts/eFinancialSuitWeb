import { SalaryDetail } from './SalaryDetail';
export class MonthlySalary {
  constructor(
    public salaryid: any,
    public createdby: any,
    public userSessionID: any,
    public prM_SALARYDET: SalaryDetail[],
  ) { }
}

