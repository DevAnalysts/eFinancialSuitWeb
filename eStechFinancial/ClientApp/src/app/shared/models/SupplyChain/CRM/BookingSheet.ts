import { BookingSheetDetail } from './BookingSheetDetail';
export class BookingSheet {
  constructor(

    public bookinG_ID: any,
    public bookinG_DATE: any,
    public useR_ID: any,//
    public areaid: any,
    public pagE_ID: any,
    //public discount: any,
    public remarks: any,
    public draft: any,
    public guid: any,
    public created_By: any,
    public userSessionID: any,
    public office_Code: any,

    public bookingsheetdetail: BookingSheetDetail[]

  ) { }
}
