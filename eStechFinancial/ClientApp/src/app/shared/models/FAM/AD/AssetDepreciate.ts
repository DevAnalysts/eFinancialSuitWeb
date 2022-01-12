import { AssetDepreciateDetails } from './AssetDepreciateDetails';
export class AssetDepreciate {
  constructor(
    public depreciationID: any,
    public depDate: any,
    public created_By: any,
    public userSessionID: any,

    public assetdepreciationdetails: AssetDepreciateDetails[]

  ) { }
}


