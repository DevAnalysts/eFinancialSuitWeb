import { StitchingDetails } from './stitchingDetail';
 
export class Stitching {
  constructor(

    public stitching_ID: any,
    public stitching_Date: any,
    public stitching_No: any,
    public knitting_No: any,
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
    public prod_StitchingDetails: StitchingDetails[],
    public status: any
     
  ) { }
}


