import { SaleReplacementDetails } from './SaleReplacementDetails';
import { SaleReplacementDetail } from './SaleReplacementDetail';

export class SaleReplacement {
  constructor(

    public sale_Replacement_ID: any,
    public replacement_Date: any,
    public office_Code: any,
    public srn_NO: any,
    public order_Envoy: any,
    public customer_ID: any,
    public sale_Invoice_ID: any,
    public contact_Person_ID: any,
    public remarks: any,
    public cancel: any,
    public sRGUID: any,
    public day_Id: any,
    public created_By: any,
    public userSessionID: any,
    public warehouseID: any,
    public saleReplacementDetails: SaleReplacementDetails[]
  ) { }
}


