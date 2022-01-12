import { priceList } from './priceList';
export class Items {
  constructor(

    public item_Code: any,
    public barcode: any,
    public subjectId: any,
    public item_Name: any,
    public item_Name_UR: any,
    public cost: any,//
    public unit_Price: any,
    public tax_Rate: any,
    public taxable: any,//
    public color: any,
    public size: any,
    public useful_Life: any,
    public make: any,
    public model: any,
    public remarks: any,
    public category_Code: any,
    public subCategory_Code: any,
    public measurement_Unit_ID: any,
    public packing_Type_ID: any,
    public packing_Quantity: any,
    public reorder_Quantity: any,
    public noOfPages: any,
    public publisher: any,
    public writer: any,
    public iSBN: any,
    public yearPublished: any,
    public edition: any,
    public supplier_ID: any,
    public bOGUID: any,
    public categoryTypeID: any,
    public itemLongCode: any,
    public parent_Item_Code: any,
    public sliceCount: any,
    public branchProduction: any,
    public creation_Date: any,
    public created_By: any,
    public modified_Date: any,
    public modified_By: any,
    public costDiscount: any,//
    public priceDiscount: any,
    public itemweight: any,
    public upp: any,
    public taxtypeid: any,//
    public status: any,
    public userSessionID: any,
    public itemimage: any,
    public abbrivation: any,
    public warranty: any,
    public uoMID: any,
    public brandId: any,
    public modelId: any, 
    
    public priceList: priceList[],
    public openingUnitCost: any,
    public openingStock: any
  ) { }
}
