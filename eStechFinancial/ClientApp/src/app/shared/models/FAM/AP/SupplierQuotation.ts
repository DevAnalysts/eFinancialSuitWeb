import { SupplierQuotationDetail } from './SupplierQuotationDetail';
export class SupplierQuotation {
  constructor(
    public quotation_ID: any,
    public quotation_Date: any,
    public rfQ_ID: any,
    public supplieR_ID: any,
    public specification: any,
    public remarks: any,  
    public cancel: any,
    public pOGUID: any,   
    public created_By: any,
    public userSessionID: any,
    public quotationDetails: SupplierQuotationDetail[]
  ) { }
}


