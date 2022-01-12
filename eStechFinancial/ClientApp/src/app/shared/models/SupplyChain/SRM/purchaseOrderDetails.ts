
export class purchaseOrderDetails {
  constructor(
    public pO_Detail_ID: any,
    public purchase_Order_ID: any,
    public item_Code: any,
    public item_Name: any,
    public pack_Quantity: any,
    public unit_Price: any,
    public upp: any,
    public quantity: any,
    public purchase_Cost: any,
    public discount_Rate: any,
    public discount_Amount: any,
    public taxrateid: any,
    public tax_Rate: any,
    public tax_Amount: any,
    public net_Amount: any,
    public edit_Mode: any,
    public stock_Qty: any ,    
    public measurement_Unit?: any  ,
    public unit_ID?: any    
  ) { }
}

