import { dailyProductionDetails } from './dailyProductionDetails';
 
export class dailyProduction {
  constructor(

    public production_ID: any,
    public prod_Date: any,
    public production_No: any,
    public contract_No: any,
    public shift: any,
    public hall_No: any,
    public shift_Incharge: any,
    public fourman: any,
    public deparment_From: any,
    public department_To: any,
    public remarks: any,
    public created_By: any,
    public userSessionID: any,
    public prod_KnittingDetails: dailyProductionDetails[],
    public status: any
     
  ) { }
}


