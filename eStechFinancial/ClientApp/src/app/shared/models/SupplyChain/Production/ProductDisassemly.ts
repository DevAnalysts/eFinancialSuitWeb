import { ProductDisassemlyDetails } from './ProductDisassemlyDetails';
export class ProductDisassemly {
  constructor(

    public disassemly_ID: any,
    public disassemly_NO: any,
    public disassemly_Date: any,
    public office_Code: any,
    public disassemly_By_ID: any,
    public remarks: any,
    public total_Amount: any,
    public balance_Amount: any,
    public paid_Amount: any,
    public created_By: any,
    public userSessionID: any,
    public productDisassemlyDetails: ProductDisassemlyDetails[]
  ) { }
}


