import { PurchaseReturnNoteDetailss } from './PurchaseReturnNoteDetailss';
import { PurchaseReturnNoteDetail } from './PurchaseReturnNoteDetail';

export class PurchaseReturnNote {
  constructor(

    public purchase_Return_ID: any,
    public return_Date: any,
    public office_Code: any,
    public prn_NO: any,
    public order_Envoy: any,
    public supplier_ID: any,
    public purchase_Invoice_ID: any,
    public contact_Person_ID: any,
    public remarks: any,
    public cancel: any,
   
    public pRNGUID: any,
    public day_Id: any,
    public created_By: any,
    public userSessionID: any,
    public warehouseID: any,
    public purchaseReturnNoteDetailss: PurchaseReturnNoteDetailss[]
  ) { }
}


