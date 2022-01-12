import { saleOrderDetails2 } from "./saleOrderDetails2";

export class saleOrderContractMainDetails {
  constructor(
    public sale_Detail_ID: any,
    public sale_Order_ID: any,
    public item_Code: any,
    public item_Name: any,
    public unit_Price: any,
    public quantity: any,
    public sale_Cost: any,
    public discount_Rate: any,
    public discount_Amount: any,
    public taxrateid: any,
    public tax_Rate: any,
    public tax_Amount: any,
    public manual_Discount: any,
    public net_Amount: any,
    public edit_Mode: any,
    public stock_Qty: any,
    public pending: any,
    public  sale_Order_Detail_ID2  : any,
    public  color  : any,
    public  size  : any,
    public  packingQty  : any,
    public  upc  : any,
    public  unit  : any,
    public  weight  : any,
    public  processing  : any,
    public  composition  : any,
    public  amountPKR  : any,
    public rate: any
  ) { }
}

