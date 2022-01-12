import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { DailyExpense } from '../../../../../shared';

@Injectable()
export class DailyExpenseService {


  URL = 'api/DailyExpense';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //expenseDetails
  expenseDetails(id: any) {
    return this.httpRepository.getData(this.URL + "/expenseDetails?id=" + id + "")
  }
  //expenseVoucherDetails
  expenseVoucherDetails(id: any) {
    return this.httpRepository.getData(this.URL + "/expenseVoucherDetails?id=" + id + "")
  }
  //getExpenseType
  getExpenseType() {
    return this.httpRepository.getData(this.URL + "/getExpenseType")
  }
  //changeExpenseType
  changeExpenseType(typeID: any) {
    return this.httpRepository.getData(this.URL + "/changeExpenseType?typeID=" + typeID + "")
  }
  //getDetailsByID
  getDetailsByID(dailyID: Number): Observable<DailyExpense> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?dailyID=" + dailyID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //voucherApproval
  voucherApproval(json: any) {
    let body = JSON.stringify(json);
    return this.httpRepository.getData(this.URL + "/voucherApproval?json=" + body + "");
  }
  ////IfExists
  //IfExists(sale_Return_ID: any) {
  //  return this.httpRepository.getData(this.URL + "/IfExists?sale_Return_ID=" + sale_Return_ID + "")
  //}
  ////guidExist
  //guidExist(guid: any) {
  //  return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  //}
  //saveExpense
  saveExpense(dailyExpense: any): Promise<any> {
    let body = JSON.stringify(dailyExpense);
   return this.httpRepository.create(this.URL, dailyExpense )
      .toPromise()
      .then(res => res.json() as DailyExpense)
      .catch()
  }
  //updateExpense
  updateExpense(dailyExpense: any): Promise<any> {
    let body = JSON.stringify(dailyExpense);
    return this.httpRepository.update(this.URL, dailyExpense )
      .toPromise()
      .then(res => res.json() as DailyExpense)
      .catch()
  }
  //handleError
  private handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');
    var serverError = error.json();
    var modelStateErrors: string = '';

    if (!serverError.type) {
      console.log(serverError);
      for (var key in serverError) {
        if (serverError[key])
          modelStateErrors += serverError[key] + '\n';
      }
    }
    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }

}
