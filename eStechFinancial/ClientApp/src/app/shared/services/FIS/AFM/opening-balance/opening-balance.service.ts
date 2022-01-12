import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { openingBalance } from '../../../../models/FIS/AFM/openingbalance';

@Injectable()
export class OpeningBalanceService {

  URL = 'api/openingBalane';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getJournalVouchers
  getJournalVouchers(voucheR_ID: any, userPrivilegedOffice:any) {
    return this.httpRepository.getData(this.URL + "/getJournalVouchers?voucheR_ID=" + voucheR_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //getAdjustmentVouchers
  getOpeningBalance(voucheR_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getOpeningBalance?voucheR_ID=" + voucheR_ID + " &userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //geBankPaymentVouchers
  
  //getOffices
  getOffices(userPrivilegedOffice :any) {
    return this.httpRepository.getData(this.URL + "/getOffices?userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //getChangeOffices
  getChangeOffices(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getChangeOffices?officE_CODE=" + officE_CODE + "");
  }
  //getBanks
  
  //getAccounts
  getAccounts(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getAccounts?officE_CODE=" + officE_CODE + "");
  }
  //getAccount
  getAccount(accountTitle: any) {
    return this.httpRepository.getData(this.URL + "/getAccount?accountTitle=" + accountTitle + "");
  }
  //getChangeAccounts
  getChangeAccounts(accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getChangeAccounts?accounT_CODE=" + accounT_CODE + "");
  }
  //getBankAccountsDayEnd
  getBankAccountsDayEnd(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getBankAccountsDayEnd?officE_CODE=" + officE_CODE + "");
  }
  //getBankAccounts
  
  //saveVoucher
  saveVoucher(voucher: any): Promise<any> {
    let body = JSON.stringify(voucher);
    // alert(body);
     return this.httpRepository.create(this.URL, voucher )
      .toPromise()
      .then(res => res.json() as openingBalance)
      .catch()
  }
  //updateVoucher
  updateVoucher(voucher: any): Promise<any> {
    let body = JSON.stringify(voucher);
    //alert(body);
    return this.httpRepository.update(this.URL, voucher )
      .toPromise()
      .then(res => res.json() as openingBalance)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(voucher_ID: any): Observable<openingBalance> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?voucher_ID=" + voucher_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getBPDetailsByID
  
  //IfExists
  IfExists(fiN_YR: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?fiN_YR=" + fiN_YR + "")
  }
  //getSupplier
  getSupplier()
  {
    return this.httpRepository.getData(this.URL + "/getSupplier");
  }
  //getCustomer
  getCustomer()
  {
    return this.httpRepository.getData(this.URL + "/getCustomer");
  }
  getItem()
  {
    return this.httpRepository.getData(this.URL + "/getItem");
  }
  //getAccountCode
  getAccountCode(acc: any){
    return this.httpRepository.getData(this.URL + "/getAccountCode?acc=" + acc);
  }
  //changeVoucherStatus
  changeVoucherStatus(ID: any, Status: any, User: any) {
    return this.httpRepository.getData(this.URL + "/changeVoucherStatus?ID=" + ID + "&Status=" + Status + "&User=" + User);
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
