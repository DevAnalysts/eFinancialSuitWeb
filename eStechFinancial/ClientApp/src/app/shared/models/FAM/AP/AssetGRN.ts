import { AssetGRNDetail } from './AssetGRNDetail';

export class AssetGRN {
  constructor(

    public goods_Receive_ID: any,
    public goods_Receive_DATE: any,
    public supplier_ID: any,
    public purchase_Order_ID: any,
    public grn_ID: any,    
    public goods_Challan_NO: any,
    public receive_Ack_DATE: any,
    public receive_Ack_By: any,
    public gR_NO: any,
    public return_Ack_DATE: any,
    public return_Ack_By: any,
    public pR_NO: any,
    public remarks: any,
    public isAcknowledge: any,
    public gRGUID: any,
    public voucher_ID: any,
    public cancel: any, 
    public goodsReceiveDetail: AssetGRNDetail[]
  ) { }
}


