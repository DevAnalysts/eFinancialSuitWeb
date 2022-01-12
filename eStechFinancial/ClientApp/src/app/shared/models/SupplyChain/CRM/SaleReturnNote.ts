import { SaleReturnNoteDetails } from './SaleReturnNoteDetails';
import { SaleReturnNoteDetail } from './SaleReturnNoteDetail';

export class SaleReturnNote {
  constructor(

    public sale_Return_ID: any,
    public return_Date: any,
    public office_Code: any,
    public srn_NO: any,
    public order_Envoy: any,
    public customer_ID: any,
    public sale_Invoice_ID: any,
    public contact_Person_ID: any,
    public remarks: any,
    public cancel: any,
    public sRNGUID: any,
    public day_Id: any,
    public created_By: any,
    public userSessionID: any,
    public warehouseID: any,
    public saleReturnNoteDetails: SaleReturnNoteDetails[]
  ) { }
}


