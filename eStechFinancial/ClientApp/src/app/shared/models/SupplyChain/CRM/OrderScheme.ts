import { OrderSchemeDetails } from './OrderSchemeDetails';
export class OrderScheme {
  constructor(
    public schemE_ID: any,
    public saleordeR_ID: any,
    public so_Date: any,
    public areaid: any,
    public iteM_CODE: any,
    public amount: any,
    public totalschemeqty: any,
    public totalschemeamount: any,
    public totalactualqty: any,
    public createdby: any,
    public userSessionID: any,
   
    public orderschemedetails: OrderSchemeDetails[]
  ) { }
}

