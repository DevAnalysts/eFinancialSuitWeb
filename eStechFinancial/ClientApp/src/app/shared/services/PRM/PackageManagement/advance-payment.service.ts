import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { voucher } from '../../../../shared';

@Injectable()
export class AdvancePaymentService {

  URL = 'api/AdvancePayment';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  ////getJournalVouchers
  //getJournalVouchers(voucheR_ID: any) {
  //  return this.httpRepository.getData(this.URL + "/getJournalVouchers?voucheR_ID=" + voucheR_ID + "");
  //}
  //geBankPaymentVouchers
  geBankPaymentVouchers(voucheR_ID: any,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/geBankPaymentVouchers?voucheR_ID=" + voucheR_ID + "&priviledged_Offices="+priviledged_Offices);
  }
  ////geCashPaymentVouchers
  //geCashPaymentVouchers(voucheR_ID: any) {
  //  return this.httpRepository.getData(this.URL + "/geCashPaymentVouchers?voucheR_ID=" + voucheR_ID + "");
  //}
  ////geBankReceiptVouchers
  //geBankReceiptVouchers(voucheR_ID: any) {
  //  return this.httpRepository.getData(this.URL + "/geBankReceiptVouchers?voucheR_ID=" + voucheR_ID + "");
  //}
  ////searchSaleOrders
  //geCashReceiptVouchers(voucheR_ID: any) {
  //  return this.httpRepository.getData(this.URL + "/geCashReceiptVouchers?voucheR_ID=" + voucheR_ID + "");
  //}
  //getOffices
  getOffices(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getOffices?priviledged_Offices="+priviledged_Offices)
  }
  //getChangeOffices
  getChangeOffices(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getChangeOffices?officE_CODE=" + officE_CODE + "");
  }
  //getEmployees
  getEmployees(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getEmployees?priviledged_Offices="+priviledged_Offices)
  }
  //getAccounts
  getAccounts(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getAccounts?officE_CODE=" + officE_CODE + "");
  }
  ////getAccount
  //getAccount(accountTitle: any) {
  //  return this.httpRepository.getData(this.URL + "/getAccount?accountTitle=" + accountTitle + "");
  //}
  //getChangeAccounts
  getChangeAccounts(accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getChangeAccounts?accounT_CODE=" + accounT_CODE + "");
  }
  //getBankAccounts
  getBankAccounts(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getBankAccounts?officE_CODE=" + officE_CODE + "");
  }
  getDebitBankAccount(page_Code: any) {
    return this.httpRepository.getData(this.URL + "/getDebitBankAccount?page_Code=" + page_Code + "");
  }
  ////getAPBankAccounts
  //getCashAccounts(officE_CODE: any) {
  //  return this.httpRepository.getData(this.URL + "/getCashAccounts?officE_CODE=" + officE_CODE + "");
  //}
  ////getChangeBankAccounts
  //getChangeBankAccounts(accounT_CODE: any) {
  //  return this.httpRepository.getData(this.URL + "/getChangeBankAccounts?accounT_CODE=" + accounT_CODE + "");
  //}
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
  ////getDetailsByID
  //getDetailsByID(voucher_ID: any): Observable<voucher> {
  //  return this.httpRepository.getData(this.URL + "/getDetailsByID?voucher_ID=" + voucher_ID + "")
  //    .map((res) => {
  //      return res.json()[0];
  //    })
  //    .catch(this.handleError);
  //}

  //getDetailsByID
  getDetailsByID(voucher_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?voucher_ID=" + voucher_ID)
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
