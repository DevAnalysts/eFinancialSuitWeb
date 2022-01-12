import { AssetRFQDetail } from './AssetRFQDetail';
export class AssetRFQ {
  constructor(
    public rfQ_ID: any,
    public rfq_Date: any,
    public remarks: any,  
    public cancel: any,
    public pOGUID: any,   
    public created_By: any,
    public userSessionID: any,
    public rfqDetails: AssetRFQDetail[]
  ) { }
}


