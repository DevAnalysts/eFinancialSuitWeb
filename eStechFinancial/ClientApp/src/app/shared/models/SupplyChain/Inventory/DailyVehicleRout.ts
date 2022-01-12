import { DailyVehicleRoutDetail } from './DailyVehicleRoutDetail';

export class DailyVehicleRout {
  constructor(

    public daily_Vehicle_Rout_ID: any,
    public area_ID: any,
    public area_Name: any,
    public date: any,
    public vehicle_ID: any,
    public vehicle: any,    
    public gSGUID: any,
    public cancel: any,
    public created_By: any,
    public userSessionID: any,
    public warehouseID: any,
    public template_ID: any,
    public dailyVehicleRoutDetail: DailyVehicleRoutDetail[],
    public driver_ID: any,
    public helper_ID: any

  ) { }
}
