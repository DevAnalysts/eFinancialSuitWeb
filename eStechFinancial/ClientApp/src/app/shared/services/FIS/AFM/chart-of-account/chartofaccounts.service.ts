import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { coas } from '@shared/models/FIS/BM/coa';
 
import { Observable } from 'rxjs/Observable';

//test
@Injectable()
export class ChartOfAccountsService {

  URL = 'api/ChartOfAccounts';
  
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
  getParentNoteId(accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getParentNoteId?accounT_CODE=" + accounT_CODE + "");
  }
  
  getNotes(btype:any) {
    return this.httpRepository.getData(this.URL + "/getNotes?btype="+btype);
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
      .then(res => res.json() as coas)
      .catch()
  }
  //updateCOA
  updateCOA(coa: any): Promise<any> {
    let body = JSON.stringify(coa);
    return this.httpRepository.update(this.URL, coa )
      .toPromise()
      .then(res => res.json() as coas)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(accounT_CODE: Number): Observable<coas> {
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
