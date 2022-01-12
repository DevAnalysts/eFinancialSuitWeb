import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { bankAccount, Account } from '../../../../../shared';

@Injectable()
export class BankAccountService {

  URL = 'api/bankAccount';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getBankAccounts
  getBankAccounts(banK_ACCOUNT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getBankAccounts?banK_ACCOUNT_CODE=" + banK_ACCOUNT_CODE + "");
  }
  //getBanks
  getBanks() {
    return this.httpRepository.getData(this.URL + "/getBanks");
  }
  //getBankBranches
  getBankBranches(banK_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getBankBranches?banK_CODE=" + banK_CODE + "");
  }
  //IfExists
  IfExists(no: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?no=" + no + "");
  }
  //getAccountOffices
  getAccountOffices() {
    return this.httpRepository.getData(this.URL + "/getAccountOffices");
  }
  //getOffices
  getOffices() {
    return this.httpRepository.getData(this.URL + "/getOffices");
  }
  //getAccountInfo
  getAccountInfo(accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getAccountInfo?accounT_CODE=" + accounT_CODE + "");
    }
    //getAccountInfos
    getAccountInfos(page: any) {
        return this.httpRepository.getData(this.URL + "/getAccountInfos?page=" + page + "");
    }

    //getBankAccountInfos
    getMaxBankAccountInfo() {
      return this.httpRepository.getData(this.URL + "/getMaxBankAccountInfo");
  }
  //getChequeBookStatus
  getChequeBookStatus(accounT_CODE: any){
    return this.httpRepository.getData(this.URL + "/getChequeBookStatus?accounT_CODE=" + accounT_CODE + "");
  }
  //updateBankAccounts
  saveBankAccounts(bankAccount: any): Promise<any> {
    let body = JSON.stringify(bankAccount);
    // alert(body);
     return this.httpRepository.create(this.URL, bankAccount )
      .toPromise()
      .then(res => res.json() as bankAccount)
      .catch()
  }
  //updateBankAccounts
  updateBankAccounts(bankAccount: any): Promise<any> {
    let body = JSON.stringify(bankAccount);
    // alert(body);
    return this.httpRepository.update(this.URL, bankAccount )
      .toPromise()
      .then(res => res.json() as bankAccount)
      .catch()
  }
  //coaOffices
  coaOffices(json: any) {
    let body = JSON.stringify(json);
    return this.httpRepository.getData(this.URL + "/coaOffices?json=" + body + "");
  }
  //getDetailsByID
  getDetailsByID(banK_ACCOUNT_CODE: Number): Observable<bankAccount> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?banK_ACCOUNT_CODE=" + banK_ACCOUNT_CODE + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //checkBankVoucherExist
  checkBankVoucherExist(banK_ACCOUNT_CODE: any)
  {
    return this.httpRepository.getData(this.URL + "/checkBankVoucherExist?banK_ACCOUNT_CODE=" + banK_ACCOUNT_CODE + "");
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
