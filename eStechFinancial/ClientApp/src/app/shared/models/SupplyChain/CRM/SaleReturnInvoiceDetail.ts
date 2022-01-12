export class SaleReturnInvoiceDetail {
    constructor(

        public sR_Detail_ID: any,
        public item_Code: any,
        public item_Name: any,
        public order_Qty_MT: any,
        public outstanding_Qty_MT: any,
        public outstanding_Qty: any,
        public quantity: any,
        public invoiced_Qty: any,
        public unit_Price: any,
        public sale_Cost: any,
        public discount_Rate: any,
        public discount_Amount: any,
        public tax_Rate: any,
        public tax_Amount: any,
        public net_Amount: any,
        public qty_Stock: any,
        public pending: any,
        public freight_Chrgs: any,
        public prevQty: any,
        public edit_Mode: any
        /*  public invoice_Detail_ID: any,
          public purchase_Invoice_ID: any,
          public item_Code: any,
          public quantity: any,
          public unit_Price: any,
          public purchase_Cost: any,
          public discount_Rate: any,
          public discount_Amount: any,
         public tax_Rate: any,
          public tax_Amount: any,
          public discount_Rate_B: any,
          public discount_Amount_B: any*/
    ) { }
}

