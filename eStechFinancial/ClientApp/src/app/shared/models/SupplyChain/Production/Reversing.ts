import { ReversingDetails } from './ReversingDetails';
 
export class Reversing {
  constructor(

    public reversing_ID: any,
    public reversing_Date: any,
    public reversing_No: any,
    public stitching_No: any,
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
    public prod_ReversingDetails: ReversingDetails[],
    public status: any
     
  ) { }
}

