import { PurchaseReturnInvoiceDetail } from './PurchaseReturnInvoiceDetail';
export class ReturnInvoice {
  constructor(
    public purchase_Return_Invoice_ID: any,
    public return_Invoice_Date: any,
    public return_Invoice_NO: any,
    public office_Code: any,
    public supplier_ID: any,
    public purchase_Return_ID: any,
    public purchase_Invoice_ID: any,
    public total_Cost: any,
    public total_Discount: any,
    public total_Tax: any,
    public total_Amount: any,
    public balanceAmount: any,
    public paidAmount: any,
    public freight_Chrgs: any,
    public adjustable: any,

    public remarks: any,
    public pRIGUID: any,
    public isUpdate: any,
    public created_By: any,
    public userSessionID: any,
    public warehouseID: any,
    public PurchaseReturnInvoiceDetail: PurchaseReturnInvoiceDetail[]
  ) { }
}


