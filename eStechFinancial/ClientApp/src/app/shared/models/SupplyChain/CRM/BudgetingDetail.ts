import { Budgeting_Detail2 } from "./BudgetingDetail2";

export class BudgetingDetail {
    constructor(
        
        public budgeting_Detail_ID: any,
        public budgeting_ID: any,
        public item_Code: any,
        public item_Name: any,
        public orderQty: any,
        public rawMatrialWaste: any,
        public cycleTime: any,
        public qty: any,
        public requiredProduction: any,
        public pair_Weight: any,
        public budgeting_Details2: Budgeting_Detail2[]
    ) { }
  }
  