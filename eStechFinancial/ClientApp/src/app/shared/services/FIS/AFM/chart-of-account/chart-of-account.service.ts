import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { coa } from '../../../../../shared';
//test
@Injectable()
export class ChartOfAccountService {

  URL = 'api/ChartOfAccount';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getCOAs
  getCOAs(accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getCOAs?accounT_CODE=" + accounT_CODE + "");
  }
  //getLevels
  getLevels() {
    return this.httpRepository.getData(this.URL + "/getLevels");
  }
  //getCategories
  getCategories() {
    return this.httpRepository.getData(this.URL + "/getCategories");
  }
  //getAccountTypies
  getAccountTypies() {
    return this.httpRepository.getData(this.URL + "/getAccountTypies");
  }
  //getAccounts
  getAccounts(leveL_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getAccounts?leveL_CODE=" + leveL_CODE + "");
  }
  //getAccountByID
  getAccountByID(accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getAccountByID?accounT_CODE=" + accounT_CODE + "");
  }
  //getBalanceSheet
  getBS() {
    return this.httpRepository.getData(this.URL + "/getBS");
  }
  //getProfitLose
  getProfitLose() {
    return this.httpRepository.getData(this.URL + "/getProfitLose");
  }
  //getMaxAccountCode
  getMaxAccountCode(leveL_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getMaxAccountCode?leveL_CODE=" + leveL_CODE + "");
  }
  //getMaxAccountCodes
  getMaxAccountCodes(leveL_CODE: any, accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getMaxAccountCodes?leveL_CODE=" + leveL_CODE + "&accounT_CODE=" + accounT_CODE + "");
  }
  //saveCOA
  saveCOA(coa: any): Promise<any> {
    let body = JSON.stringify(coa);
  //  alert(body);
     return this.httpRepository.create(this.URL, coa )
      .toPromise()
      .then(res => res.json() as coa)
      .catch()
  }
  //updateCOA
  updateCOA(coa: any): Promise<any> {
    let body = JSON.stringify(coa);
    return this.httpRepository.update(this.URL, coa )
      .toPromise()
      .then(res => res.json() as coa)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(accounT_CODE: Number): Observable<coa> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?accounT_CODE=" + accounT_CODE + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
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
