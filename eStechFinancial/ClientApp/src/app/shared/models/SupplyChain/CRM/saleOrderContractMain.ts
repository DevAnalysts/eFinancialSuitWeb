import { saleOrderContractMainDetails } from './saleOrderContractMainDetail';
import { itemStockIMEI } from '../srm/itemstockimei';
import { saleOrderContract} from './saleOrderContract';
import {saleOrderDetails2} from './saleOrderDetails2';
export class saleOrderContractMain {
  constructor(

    public sale_Order_ID: any,
    public sO_Date: any,
    public officE_CODE: any,
    public sale_Envoy: any,
    public customer_ID: any,
    public contact_ID: any,
    public delivery_Date: any,
    public shipping_Method: any,
    public payment_ID: any,
    public freight_Term: any,
    public total_Cost: any,
    public total_Discount: any,
    public total_Tax: any,
    public freight_Chrgs: any,
    public total_Amount: any,
    public paid_Amount: any,
    public reorder_ID: any,
    public quotation_ID: any,
    public order_Type: any,
    public remarks: any,
    public cancel: any,
    public company_ID: any,
    public manual_Discount: any,
    public entry_Date: any,
    public user_ID: any,
    public is_Update: any,
    public sOGUID: any,
    public IsDirect: any,
    public sD_Rate: any,
    public sD_Amount: any,
    public specialDiscount: any,
    public exchange: any,
    public scheme: any,
    public created_By: any,
    public userSessionID: any,
    public template_ID: any,
    public refCustomerID: any,
    public warehouseID: any,   
    public saleOrderDetails: saleOrderContractMainDetails[],
    public itemStockIMEI: itemStockIMEI[],
    
    public saleOrderDetails2 : saleOrderDetails2[],
    public saleOrderContract: saleOrderContract[]
  ) { }
}


