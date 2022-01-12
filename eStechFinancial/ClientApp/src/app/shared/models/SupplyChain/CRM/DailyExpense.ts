import { dailyExpenseDetail } from './dailyExpenseDetail';

export class DailyExpense {
  constructor(

    public dailyID: any,
    public calenderDate: any,
    public totalAmount: any,
    public officeCode: any,
    public active: any,
    public remarks: any,   
    public dailyExpenseDetail: dailyExpenseDetail[]
  ) { }
}


