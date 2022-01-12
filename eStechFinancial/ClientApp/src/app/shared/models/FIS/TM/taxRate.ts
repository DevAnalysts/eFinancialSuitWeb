import { taxRateDetail } from './taxRateDetail';
export class taxRate {
  constructor(
    public taxRateID: any,
    public title: any,
    public taxRate: any,
    public taxTypeID: any,
    public remarks: any,
    public status: any,
    public gUID: any,
    public createdBy: any,

    public taxrateDetail: taxRateDetail[]
  ) { }
}


