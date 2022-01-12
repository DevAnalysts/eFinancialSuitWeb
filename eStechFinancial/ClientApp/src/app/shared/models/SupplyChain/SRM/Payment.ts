import { purchasePaymentDetails } from './purchasePaymentDetails';
export class Payment {

  constructor(
    public purchase_Payment_ID: any,
    public payment_Date: any,
    public payment_NO: any,
    public office_Code: any,
    public supplier_ID: any,
    public total_Cost: any,
    public total_Discount: any,
    public total_Tax: any,
    public freight_Chrgs: any,
    public total_Amount: any,
    public balance_Amount: any,
    public paid_Amount: any,
    public return_Amount: any,
    public remarks: any,
    public pPGUID: any,
    public methodID: any,
    public accountCode: any,
    public chequeNo: any,    
    public modifieD_DATE: any, //Cheque Date
    public payto: any, //Cheque Pay To
    public cancel: any,
    public voucher_ID: any,
    public created_By: any,
    public userSessionID: any,
    public advance: any,
    public adjust: any, 
    public purchasePaymentDetails: purchasePaymentDetails[],
    public refrence_No: any,
  ) { }
}


