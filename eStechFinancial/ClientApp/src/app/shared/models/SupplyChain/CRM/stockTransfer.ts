import { stockTransferDetails } from "./stockTransferDetails";

 
export class stockTransfer {
  constructor(

    public stock_Trans_ID: any,
    public sT_Date: any,
    public officE_CODE: any,  
    public from_Office: any, 
    public to_Office: any,  
    public created_By: any,
    public template_ID: any, 
    public from_WarehouseID: any,   
    public to_WarehouseID: any,   
    public stockTransferDetails:stockTransferDetails[]
  ) { }
}


