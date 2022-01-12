import { ItemsAdjustmentDetail } from './ItemsAdjustmentDetail';
export class ItemsAdjustment {
  constructor(

    public iteM_ADJUSTMENT_ID: any,
    public subcategorY_CODE: any,
    public date: any,//
    public remarks: any,
    public adjustable: any,
    public created_By: any,
    public userSessionID: any,
    public userCurrentOffice: any,
    public userCurrentWarehouseID: any,
    public scM_ITEMADJUSTMENTDETAIL: ItemsAdjustmentDetail[]

  ) { }
}
