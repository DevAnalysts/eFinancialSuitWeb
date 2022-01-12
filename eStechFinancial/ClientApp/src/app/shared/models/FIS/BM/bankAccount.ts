import { coaOffice } from './coaOffice';
export class bankAccount {
  constructor(

    public banK_ACCOUNT_CODE: any,
    public banK_CODE: any,
    //public banK_NAME: any,
    public brancH_CODE: any,
    //public brancH_NAME: any,
    public accounT_CODE: any,
    public accounT_NO: any,
    public accounT_NAME: any,
    public accounT_TITLE: any,
    public officE_CODE: any,
    //public officE_NAME: any,
    public active: any,
    public coA_GROUP: any,
    public pL_BALSHEET: any,
    public leveL_CODE: any,
    public categorY_CODE: any,
    public accT_TYPE_CODE: any,
    public currency: any, 
    public displaY_ACCOUNT_CODE: any,
    public created_By: any,
    public userSessionID: any,
    
    public fiS_COA_OFFICE: coaOffice[]
  ) { }
}
