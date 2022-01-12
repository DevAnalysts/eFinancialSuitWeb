import { AdvanceVoucherDetails } from './AdvanceVoucherDetails';
export class AdvanceVoucher {
  constructor(
    
    public voucher_ID: any,
    public voucheR_NO: any,
    public voucheR_DATE: any,
    public officE_CODE: any,
    public banK_CODE: any,
    public brancH_CODE: any,
    public chequE_NO: any,
    public chequE_DATE: any,
    public cancel: any,    
    public voucheR_TYPE_CODE: any,
    //public modulE_NAME: any,
    //public systeM_GEN: any,
    //public pay_To: any,
    //public address: any,
    public invoice_Amt: any,
    //public tax_deduct: any,
    //public other_Deduct: any,
    public net_Paied: any,
    public invoice_No: any,
    public bank_Acct_No: any,
    public page_Code: any,
    public voucher_GUID: any,
    public pay_Method,     
    public vendor: any,
    public customer: any,
    public remarks: any,
    public approvE_BY: any,
    public approvE_DATE: any,
    //public banK_ACCOUNT_CODE: any,
    //public debit: any,
    //public credit: any,
    public voucherDetails: AdvanceVoucherDetails[]
  ) { }
}


