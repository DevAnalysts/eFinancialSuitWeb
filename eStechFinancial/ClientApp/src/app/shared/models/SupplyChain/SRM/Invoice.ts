import { PurchaseInvoiceDetail } from './PurchaseInvoiceDetail';
export class SCM_Purchase_Invoice {
  constructor(
    public purchase_Invoice_ID: any,
    public invoice_Date: any,
    public delivery_Date: any,
    public invoice_NO: any,
    public office_Code: any,
    public supplier_ID: any,
    public purchase_Order_ID: any,
    public goods_Receive_ID: any,
    public total_Cost: any,
    public total_Discount: any,
    public total_Tax: any,
    public freight_Chrgs: any,
    public total_Amount: any,
    public balanceAmount: any,
    public paidAmount: any,
    public remarks: any,
    public pIGUID: any,
    public isUpdate: any,
    public exchange: any,
    public directGRN: any,
    public cancel: any,
    public voucher_ID: any,
    public created_By: any,
    public userSessionID: any,

    public purchaseInvoiceDetail: PurchaseInvoiceDetail[]
  ) { }
}


