import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Payment } from '../../../../../shared';

@Injectable()
export class SupplierPaymentService {

  url = 'api/SupplierPayment';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getPaymentDetails
  getPaymentDetails() {
    return this.httpRepository.getData(this.url + "/getPaymentDetails")
  }
  //searchPaymentDetails
  searchPaymentDetails(supplier_Name: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.url + "/searchPaymentDetails?supplier_Name=" + supplier_Name + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }

  //getCustomers
  getSuppliers(priviledged_Offices: any, purchase_Payment_ID: any, allowAvance: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getSuppliers?priviledged_Offices=" + priviledged_Offices + "&purchase_Payment_ID=" + purchase_Payment_ID + "&allowAvance=" + allowAvance + "&mode=" + mode + "")
  }
  //getContacts
  getContacts(supplier_ID: Number) {
    return this.httpRepository.getData(this.url + "/getContacts?supplier_ID=" + supplier_ID + "")
  }
  //getPaymentMethods
  getPaymentMethods(supplier_ID: Number) {
    return this.httpRepository.getData(this.url + "/getPaymentMethods?supplier_ID=" + supplier_ID + "")
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
  getInvoiceDetails(supplier_ID: Number, purchase_Payment_ID: Number, invoicedate: any, priviledged_Offices: any, mode: Boolean) {
    return this.httpRepository.getData(this.url + "/getInvoiceDetails?supplier_ID=" + supplier_ID + "&purchase_Payment_ID=" + purchase_Payment_ID + "&invoicedate=" + invoicedate + "&priviledged_Offices=" + priviledged_Offices + "&mode=" + mode + "")
  }
  //getPaymentDetailValues
  getPaymentDetailValues(purchase_Payment_ID: Number) {
    return this.httpRepository.getData(this.url + "/getPaymentDetailValues?purchase_Payment_ID=" + purchase_Payment_ID + "")
  }
  //IfExists
  IfExists(purchase_Payment_ID: any, supplier_ID: any, payment_Date: any) {
    return this.httpRepository.getData(this.url + "/IfExists?purchase_Payment_ID=" + purchase_Payment_ID + "&supplier_ID=" + supplier_ID + "&payment_Date=" + payment_Date + "")
  }
  //getDetailsByID
  getDetailsByID(purchase_Payment_ID: Number): Observable<Payment> {
    return this.httpRepository.getData(this.url + "/getDetailsByID?purchase_Payment_ID=" + purchase_Payment_ID + "")
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
   return this.httpRepository.create(this.url, payment )
      .toPromise()
      .then(res => res.json() as Payment)
      .catch()
  }
  //updatePayment
  updatePayment(payment: any): Promise<any> {
    let body = JSON.stringify(payment);
    //  alert(body);
    return this.httpRepository.update(this.url, payment )
      .toPromise()
      .then(res => res.json() as Payment)
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

