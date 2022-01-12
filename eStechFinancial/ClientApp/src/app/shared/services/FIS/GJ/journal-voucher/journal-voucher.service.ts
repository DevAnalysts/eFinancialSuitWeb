import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { voucher } from '../../../../../shared';

@Injectable()
export class JournalVoucherService {

  URL = 'api/journalVoucher';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getJournalVouchers
  getJournalVouchers(voucheR_ID: any, userPrivilegedOffice:any) {
    return this.httpRepository.getData(this.URL + "/getJournalVouchers?voucheR_ID=" + voucheR_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //getAdjustmentVouchers
  getAdjustmentVouchers(voucheR_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getAdjustmentVouchers?voucheR_ID=" + voucheR_ID + " &userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //geBankPaymentVouchers
  geBankPaymentVouchers(voucheR_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/geBankPaymentVouchers?voucheR_ID=" + voucheR_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //geCashPaymentVouchers
  geCashPaymentVouchers(voucheR_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/geCashPaymentVouchers?voucheR_ID=" + voucheR_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //geBankReceiptVouchers
  geBankReceiptVouchers(voucheR_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/geBankReceiptVouchers?voucheR_ID=" + voucheR_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //searchSaleOrders
  geCashReceiptVouchers(voucheR_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/geCashReceiptVouchers?voucheR_ID=" + voucheR_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //getOffices
  getOffices(userPrivilegedOffice :any) {
    return this.httpRepository.getData(this.URL + "/getOffices?userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //getChangeOffices
  getChangeOffices(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getChangeOffices?officE_CODE=" + officE_CODE + "");
  }
  //getBanks
  getBanks() {
    return this.httpRepository.getData(this.URL + "/getBanks");
  }
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
  getBankAccounts(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getBankAccounts?officE_CODE=" + officE_CODE + "");
  }
  //getBankAccountsBRV
  getBankAccountsBRV(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getBankAccountsBRV?officE_CODE=" + officE_CODE + "");
  }
  //getAPBankAccounts
  getCashAccounts(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getCashAccounts?officE_CODE=" + officE_CODE + "");
  }
  //getChangeBankAccounts
  getChangeBankAccounts(accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getChangeBankAccounts?accounT_CODE=" + accounT_CODE + "");
  }
  //getChequeNo
  getChequeNo(accounT_CODE: any, status: any, active: any) {
    return this.httpRepository.getData(this.URL + "/getChequeNo?accounT_CODE=" + accounT_CODE + "&status=" + status + "&active=" + active + "");
  }
  //saveVoucher
  saveVoucher(voucher: any): Promise<any> {
    let body = JSON.stringify(voucher);
    // alert(body);
     return this.httpRepository.create(this.URL, voucher )
      .toPromise()
      .then(res => res.json() as voucher)
      .catch()
  }
  //updateVoucher
  updateVoucher(voucher: any): Promise<any> {
    let body = JSON.stringify(voucher);
    //alert(body);
    return this.httpRepository.update(this.URL, voucher )
      .toPromise()
      .then(res => res.json() as voucher)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(voucher_ID: any): Observable<voucher> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?voucher_ID=" + voucher_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getBPDetailsByID
  getBPDetailsByID(voucher_ID: any): Observable<voucher> {
    return this.httpRepository.getData(this.URL + "/getBPDetailsByID?voucher_ID=" + voucher_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getCPDetailsByID
  getCPDetailsByID(voucher_ID: any): Observable<voucher> {
    return this.httpRepository.getData(this.URL + "/getCPDetailsByID?voucher_ID=" + voucher_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getBCDetailsByID
  getBCDetailsByID(voucher_ID: any): Observable<voucher> {
    return this.httpRepository.getData(this.URL + "/getBCDetailsByID?voucher_ID=" + voucher_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getCRDetailsByID
  getCRDetailsByID(voucher_ID: any): Observable<voucher> {
    return this.httpRepository.getData(this.URL + "/getCRDetailsByID?voucher_ID=" + voucher_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //IfExists
  IfExists(fiN_YR: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?fiN_YR=" + fiN_YR + "")
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
