import { GoodsSupplyDetail } from './GoodsSupplyDetail';

export class GoodsSupply {
  constructor(

    public goods_Supply_ID: any,
    public supply_NO: any,
    public supply_Date: any,
    public customer_ID: any,
    public sale_Order_ID: any,    
    public challan_NO: any,
    public office_Code: any,
    public sale_Rep_ID: any,
    public remarks: any, 
    public gSGUID: any,
    public voucher_ID: any,
    public cancel: any,
    public created_By: any,
    public userSessionID: any,
    public warehouseID: any,
    public driver: any,
    public vehicle: any,
    public template_ID: any,
    public dispatchFrom: any,
    public goodsSupplyDetail: GoodsSupplyDetail[]

  ) { }
}


