import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { ReturnInvoice } from '../../../../../shared';

@Injectable()
export class PurchaseReturnInvoiceService {
  url = 'api/PurchaseReturnInvoice';


  constructor(private httpRepository: RepositoryHttpService) { }
  //getInvoives
  getInvoives() {
    return this.httpRepository.getData(this.url + "/invoiceDetails")
  }
  //searchInvoiceDetails
  searchInvoiceDetails(purchase_Return_Invoice_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.url + "/searchInvoiceDetails?purchase_Return_Invoice_ID=" + purchase_Return_Invoice_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(purchase_Return_Invoice_ID: Number): Observable<ReturnInvoice> {
    return this.httpRepository.getData(this.url + "/getInvoiceDetailsByID?invoice_ID=" + purchase_Return_Invoice_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getPendingSupplier
  getPendingSupplier(priviledged_Offices: any, purchase_Return_ID: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getPendingSupplier?priviledged_Offices=" + priviledged_Offices + "&purchase_Return_ID=" + purchase_Return_ID + "&mode=" + mode + "")
  }
  //getPendingSupplier
  getPendingOrder(priviledged_Offices: any, supplier_ID: any, purchase_Return_ID: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrder?priviledged_Offices=" + priviledged_Offices + "&supplier_ID=" + supplier_ID + "&purchase_Return_ID=" + purchase_Return_ID + "&mode=" + mode + "")
  }
  //getPendingOrderDetails
  getPendingOrderDetails(supplier_ID: any, purchase_Return_ID: any, purchase_Return_Invoice_ID: any, purchase_Invoice_ID: any, userCurrentOffice: any, userCurrentWarehouse: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrderDetails?supplier_ID=" + supplier_ID + "&purchase_Return_ID=" + purchase_Return_ID + "&purchase_Return_Invoice_ID=" + purchase_Return_Invoice_ID + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&mode=" + mode + "")
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
  saveInvoice(returnInvoice: any): Promise<any> {
    let body = JSON.stringify(returnInvoice);
    //  alert(body);
    return this.httpRepository.create(this.url, returnInvoice)
      .toPromise()
      .then(res => res.json() as ReturnInvoice)
      .catch()
  }
  //updateInvoice
  updateInvoice(returnInvoice: any): Promise<any> {
    let body = JSON.stringify(returnInvoice);
    // alert(body);
    return this.httpRepository.update(this.url, returnInvoice)
      .toPromise()
      .then(res => res.json() as ReturnInvoice)
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

