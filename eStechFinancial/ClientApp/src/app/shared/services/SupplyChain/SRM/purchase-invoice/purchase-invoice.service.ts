import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { SCM_Purchase_Invoice } from '../../../../../shared';

@Injectable()
export class PurchaseInvoiceService {
  url = 'api/PurchaseInvoice';
   
   constructor(private httpRepository: RepositoryHttpService) { }
  //getInvoives
  getInvoives(purchase_Invoice_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.url + "/invoiceDetails?purchase_Invoice_ID=" + purchase_Invoice_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //searchInvoiceDetails
  searchInvoiceDetails(purchase_Invoice_ID: any) {
    return this.httpRepository.getData(this.url + "/searchInvoiceDetails?purchase_Invoice_ID=" + purchase_Invoice_ID + "")
  }
  //getTaxRates
  getTaxRates() {
    return this.httpRepository.getData(this.url + "/getTaxRates")
  }
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(purchase_Invoice_ID: Number): Observable<SCM_Purchase_Invoice> {
    return this.httpRepository.getData(this.url + "/getInvoiceDetailsByID?invoice_ID=" + purchase_Invoice_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getPendingSupplier
  getPendingSupplier(userCurrentOffice:any, userCurrentWarehouse:any, supplier_ID: any, mode: any, allowInvoice: any) {
    return this.httpRepository.getData(this.url + "/getPendingSupplier?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&supplier_ID=" + supplier_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "")
  }
  //getPendingSupplier
  getPendingOrder(userCurrentOffice: any, userCurrentWarehouse: any, supplier_ID: any, purchase_Invoice_ID: any, goods_Receive_ID: any, mode: any, allowInvoice: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrder?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Invoice_ID + "&goods_Receive_ID=" + goods_Receive_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "")
  }
  //getPendingOrderDetails
  getPendingOrderDetails(userCurrentOffice: any, userCurrentWarehouse: any,supplier_ID: any, purchase_Order_ID: any, purchase_Invoice_ID: any, goods_Receive_ID:any, mode: any, allowInvoice: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrderDetails?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Order_ID + "&purchase_Invoice_ID=" + purchase_Invoice_ID + "&goods_Receive_ID=" + goods_Receive_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "")
  }
  //IfPaymentExists
  IfPaymentExists(purchase_Invoice_ID: any) {
    return this.httpRepository.getData(this.url + "/IfPaymentExists?purchase_Invoice_ID=" + purchase_Invoice_ID + "")
  }  
  //IfExists
  IfExists(purchase_Order_ID: any) {
    return this.httpRepository.getData(this.url + "/IfExists?purchase_Order_ID=" + purchase_Order_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.url + "/guidExist?guid=" + guid + "")
  }
  //cancelInvoice
  cancelInvoice(ID: any, actionID: any) {
    return this.httpRepository.getData(this.url + "/cancelInvoice?ID=" + ID + "&actionID=" + actionID + "")
  }
  //saveInvoice
  saveInvoice(invoice: any): Promise<any> {
    let body = JSON.stringify(invoice);
    //  alert(body);
   return this.httpRepository.create(this.url, invoice )
      .toPromise()
      .then(res => res.json() as SCM_Purchase_Invoice)
      .catch()
  }
  //updateInvoice
  updateInvoice(invoice: any): Promise<any> {
    let body = JSON.stringify(invoice);
    // alert(body);
    return this.httpRepository.update(this.url, invoice )
      .toPromise()
      .then(res => res.json() as SCM_Purchase_Invoice)
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


