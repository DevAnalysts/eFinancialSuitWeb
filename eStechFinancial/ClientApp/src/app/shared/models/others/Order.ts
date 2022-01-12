import { OrderDetailss } from './OrderDetailss';
import { OrderDetail } from './OrderDetail';
export class Order {
    constructor(

                public purchase_Order_ID : any ,
                public pO_Date : any ,
                public office_Code : any ,
                public pO_NO : any ,
                public order_Envoy : any ,
                public approved_By_ID : any ,
                public isApproved : any ,
                public supplier_ID : any ,  
                public contact_Person_ID : any ,
                public delivery_Date : any ,
                public shipping_Date : any ,
                public shipping_Method : any ,
                public payment_ID: any ,
                public freight_Term : any ,
                public total_Cost : any ,
                public total_Discount : any ,
                public pre_Tax_Amount : any ,
                public total_Tax : any ,
                public freight_Chrgs : any ,
                public total_Amount : any ,
                public remarks : any ,
                public reorder_ID : any ,
                public order_Type : any ,
                public paymentDate : any ,
                public voucher_ID : any ,
                public pay_Voucher_ID : any ,
                public cancel : any ,
              /*public Creation_Date : any ,
                public Created_By : any ,
                public Modified_Date : any ,
                public Modified_By : any ,*/
                public isUpdate : any ,
                public pOGUID : any ,
                public customer_ID : any ,
                public c_Contact_Person_ID : any ,
                public requisition_ID : any ,
                public day_Id : any ,
                public isServiceInvoice : any ,
                public orderDetailss:OrderDetailss[]
            ) { }
}

  
