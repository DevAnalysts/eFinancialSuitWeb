import { AssetRequisitionDetails } from './AssetRequisitionDetails';
export class AssetRequisition {
  constructor(

    public requisitionid: any,
    public requisitiondate: any,
    public requestedbyid: any,
    public remarks: any,
    public created_By: any,
    public userSessionID: any,

    public assetrequisitiondetails: AssetRequisitionDetails[]
  ) { }
}


