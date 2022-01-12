import { BudgetingDetail } from "./BudgetingDetail";

export class Budgeting {
    constructor(
      public budgeting_ID: any,
      public date: any,
      public contractNo: any,
      public productionType: any,
      public party: any,
      public budgetingDetails: BudgetingDetail[],
      public created_By: any, 
      public warehouseID: any,
      public offiecCode: any,
      public userSessionID: any
     
    ) { }
  }
  