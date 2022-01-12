import { DailySaleLoadDetail } from './DailySaleLoadDetail';
export class DailySaleLoad {
  constructor(

    public dailySaleLoadID: any,
    public saleDate: any,
    public user_ID: any,
    public areaID: any,
    public totalLoad: any,
    public totalLessReturn: any,
    public totalGrossSale: any,
    public totalRP: any,
    public totalNetSale: any,
    public totalLPD: any,
    public remarks: any,
    public createdBy:any,

    public dailySaleLoadDetail: DailySaleLoadDetail[]

  ) { }
}
