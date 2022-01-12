import { SaleReturnInvoiceDetail } from './SaleReturnInvoiceDetail';
export class SaleReturnInvoice {
  constructor(
    public sale_Return_Invoice_ID: any,
    public return_Invoice_Date: any,
    public return_Invoice_NO: any,
    public office_Code: any,
    public customer_ID: any,
    public sale_Return_ID: any,
    public sale_Invoice_ID: any,
    public total_Cost: any,
    public total_Discount: any,
    public total_Tax: any,
    public freight_Chrgs: any,
    public special_Discount: any,
    public total_Amount: any,
    public balanceAmount: any,
    public paidAmount: any,
    public adjustable: any,
    public remarks: any,
    public sRIGUID: any,
    public isUpdate: any,
    public created_By: any,
    public userSessionID: any,
    public warehouseID: any,

    public SaleReturnInvoiceDetail: SaleReturnInvoiceDetail[]
  ) { }
}


