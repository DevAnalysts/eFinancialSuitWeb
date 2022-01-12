import { RecipeCardDetails } from './RecipeCardDetails';
export class RecipeCard {
  constructor(
    public rC_ID: any,
    public rC_Date: any,
    public rC_NO: any,
    public item_Code: any,
    //public item_Names: any,
    public office_Code: any,
    public remarks: any,
    public cRGUID: any,
    public created_By: any,
    public userSessionID: any,
    public materialfor: any,
    public maxbatchsize: any,
    public recipeCardDetails: RecipeCardDetails[],
    public unitID: any,
  ) { }
}


