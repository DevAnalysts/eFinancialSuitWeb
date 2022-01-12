import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { salePayment } from '../../../../../shared';


@Injectable()
export class CustomerReceiptService {
  url = 'api/CustomerPayment';

   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getPaymentDetails
  getPaymentDetail() {
    return this.httpRepository.getData(this.url + "/getPaymentDetails")
  }
  //searchPaymentDetails
  searchPaymentDetails(sale_Payment_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.url + "/searchPaymentDetails?sale_Payment_ID=" + sale_Payment_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getArea
  getArea() {
    return this.httpRepository.getData(this.url + "/getArea")
  }
  //getCustomers
  getCustomers(AreaID: any, priviledged_Offices: any, sale_Payment_ID: any, allowAvance: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getCustomers?AreaID=" + AreaID + "&priviledged_Offices=" + priviledged_Offices + "&sale_Payment_ID=" + sale_Payment_ID + "&allowAvance=" + allowAvance + "&mode=" + mode + "")
  }
  //getContacts
  getContacts(customer_ID: Number) {
    return this.httpRepository.getData(this.url + "/getContacts?customer_ID=" + customer_ID + "")
  }
  //getPaymentMethods
  getPaymentMethods() {
    return this.httpRepository.getData(this.url + "/getPaymentMethods")
  }
  //getBanks
  getBanks() {
    return this.httpRepository.getData(this.url + "/getBanks")
  }
  //getBankAccounts
  getBankAccounts(method_ID: Number) {
    return this.httpRepository.getData(this.url + "/getBankAccounts?method_ID=" + method_ID + "")
  }
  //getChequeNumbers
  getChequeNumbers(accountCode) {
    return this.httpRepository.getData(this.url + "/getChequeNumbers?accountCode=" + accountCode + "")
  }
  //getInvoiceDetails
  getInvoiceDetails(customer_ID: Number, sale_Payment_ID: Number, invoicedate: any, userPrivilegedOffice: any, mode: Boolean) {

    return this.httpRepository.getData(this.url + "/getInvoiceDetails?customer_ID=" + customer_ID + "&sale_Payment_ID=" + sale_Payment_ID + "&invoicedate=" + invoicedate + "&userPrivilegedOffice=" + userPrivilegedOffice + "&mode=" + mode + "")
  }
  //getPaymentDetailValues
  getPaymentDetailValues(sale_Payment_ID: Number) {
    return this.httpRepository.getData(this.url + "/getPaymentDetailValues?sale_Payment_ID=" + sale_Payment_ID + "")
  }
  //getPaymentDetailsByID
  getPaymentDetailsByID(sale_Payment_ID: Number) {
    return this.httpRepository.getData(this.url + "/getDetailsByID?sale_Payment_ID=" + sale_Payment_ID + "")
  }
  //IfExists
  IfExists(sale_Payment_ID: any, customer_ID: any, payment_Date: any) {
    return this.httpRepository.getData(this.url + "/IfExists?sale_Payment_ID=" + sale_Payment_ID + "&customer_ID=" + customer_ID + "&payment_Date=" + payment_Date + "")
  }
  //getDetailsByID
  getDetailsByID(sale_Payment_ID: Number): Observable<salePayment> {
    return this.httpRepository.getData(this.url + "/getDetailsByID?sale_Payment_ID=" + sale_Payment_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.url + "/guidExist?guid=" + guid + "")
  }
  //cancelPayment
  cancelPayment(ID: any, actionID: any) {
    return this.httpRepository.getData(this.url + "/cancelPayment?ID=" + ID + "&actionID=" + actionID + "")
  }
  //savePayment
  savePayment(payment: any): Promise<any> {
    let body = JSON.stringify(payment);
    // alert(body);
   return this.httpRepository.create(this.url, payment )
      .toPromise()
      .then(res => res.json() as salePayment)
      .catch()
  }
  //updatePayment
  updatePayment(payment: any): Promise<any> {
    let body = JSON.stringify(payment);
    //  alert(body);
    return this.httpRepository.update(this.url, payment )
      .toPromise()
      .then(res => res.json() as salePayment)
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
