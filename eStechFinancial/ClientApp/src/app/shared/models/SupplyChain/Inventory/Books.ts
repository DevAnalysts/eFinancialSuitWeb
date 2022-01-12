import { Subjects } from './Subjects';
import { priceList } from './priceList';
export class Books {
  constructor(

    public item_Code: any,
    public item_Name: any,
    public barcode: any,
    public categorY_CODE: any,
    public subcategorY_CODE: any,
    public subjectId: any,
    public isbn: any,
    public writer: any,
    public noofpages: any,
    public supplieR_ID: any,
    public yearPublished: any,
    public country_Id: any,
    public edition: any,
    public reorder_Quantity: any,
    public remarks: any,
    public status: any,
    public cost: any,//
    public uniT_PRICE: any,//
    public costDiscount: any,//
    public taxable: any,//
    public taxtypeid: any,//
    public created_By: any,
    public userSessionID: any,
    public boguid: any,
    public selectedsubject: Subjects[],
    
    public priceList: priceList[]
  ) { }
}
