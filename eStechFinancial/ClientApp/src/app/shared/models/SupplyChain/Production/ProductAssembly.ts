import { ProductAssemblyDetails } from './ProductAssemblyDetails';
export class ProductAssembly {
  constructor(

    public consume_ID: any,
    public consume_NO: any,
    public consume_Date: any,
    public office_Code: any,
    public consume_By_ID: any,
    public remarks: any,
    public total_Amount: any,
    public balance_Amount: any,
    public paid_Amount: any,
    public created_By: any,
    public userSessionID: any,
    public gUID: any,
    public batch_No: any,
    public office: any,
    public warehouseID: any,
    public productAssemblyDetails: ProductAssemblyDetails[]
  ) { }
}


