import { StockOpeningBalanceDetail } from './StockOpeningBalanceDetail';
export class StockOpeningBalance {
  constructor(

    public voucher_ID: any,
    public voucheR_NO: any,
    public voucheR_DATE: any,
    public oPBAL_DATE: any,
    public officE_CODE: any,
    
    public cancel: any,    
    
    public page_Code: any,
    
    public remarks: any,
    public approvE_BY: any,
    public approvE_DATE: any,
    public created_By: any,
    public userSessionID: any, 
    public itemCode: any,
    public itemName: any,
    public openingUnitCost: any,
    public openingBalance: any,
    public openingStock: any,
   
    public edit_Mode: any,
    public voucherDetails: StockOpeningBalanceDetail[],
    public fin_YR: any
  ) { }
}
