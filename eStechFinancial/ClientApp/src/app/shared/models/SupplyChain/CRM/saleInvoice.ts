import { saleInvoiceDetails } from './saleInvoiceDetails';
export class saleInvoice {
  constructor(
    public sale_Invoice_ID: any,
    public invoice_Date: any,
    public office_Code: any,
    public isSaleTaxInv: any,
    public customer_ID: any,
    public sale_Order_ID: any,
    public goods_Supply_ID: any,
    public total_Cost: any,
    public total_Discount: any,
    public total_Tax: any,
    public freight_Chrgs: any,
    public total_Amount: any,
    public paidAmount: any,
    public balanceAmount: any,
    public exchange: any,
    public remarks: any,
    public sIGUID: any,
    public DirectGDN: any,
    public cancel: any,
    public specialDiscount: any,
    public created_By: any,
    public userSessionID: any,
    public template_ID: any,
    public voucher_ID: any,
    public warehouseID: any,
    public refCustomerID: any,
    public saleInvoiceDetails: saleInvoiceDetails[]
  ) { }
}


