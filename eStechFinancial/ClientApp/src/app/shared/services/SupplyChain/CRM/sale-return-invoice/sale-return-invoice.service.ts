import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { SaleReturnInvoice } from '../../../../../shared';

@Injectable()
export class SaleReturnInvoiceService {

  url = 'api/SaleReturnInvoice';

  constructor(private httpRepository: RepositoryHttpService) { }

  //getInvoives
  getInvoives() {
    return this.httpRepository.getData(this.url + "/invoiceDetails")
  }
  //searchInvoiceDetails
  searchInvoiceDetails(sale_Return_Invoice_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.url + "/searchInvoiceDetails?sale_Return_Invoice_ID=" + sale_Return_Invoice_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(sale_Return_Invoice_ID: Number): Observable<SaleReturnInvoice> {
    return this.httpRepository.getData(this.url + "/getInvoiceDetailsByID?invoice_ID=" + sale_Return_Invoice_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getPendingSupplier
  getPendingCustomer(priviledged_Offices: any, sale_Return_ID: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getPendingCustomer?priviledged_Offices=" + priviledged_Offices + "&sale_Return_ID=" + sale_Return_ID + "&mode=" + mode + "")
  }
  //getPendingSupplier
  getPendingOrder(priviledged_Offices: any, customer_ID: any, sale_Return_ID: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrder?priviledged_Offices=" + priviledged_Offices + "&customer_ID=" + customer_ID + "&sale_Return_ID=" + sale_Return_ID + "&mode=" + mode + "")
  }
  //getPendingOrderDetails 
  getPendingOrderDetails(customer_ID: any, sale_Return_ID: any, sale_Return_Invoice_ID: any, sale_Invoice_ID: any, userCurrentOffice: any, userCurrentWarehouse: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrderDetails?customer_ID=" + customer_ID + "&sale_Return_ID=" + sale_Return_ID + "&sale_Return_Invoice_ID=" + sale_Return_Invoice_ID + "&sale_Invoice_ID=" + sale_Invoice_ID + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&mode=" + mode + "")
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
    // alert(body);
    return this.httpRepository.create(this.url, returnInvoice)
      .toPromise()
      .then(res => res.json() as SaleReturnInvoice)
      .catch()
  }
  //updateInvoice
  updateInvoice(returnInvoice: any): Promise<any> {
    let body = JSON.stringify(returnInvoice);
    // alert(body);
    return this.httpRepository.update(this.url, returnInvoice)
      .toPromise()
      .then(res => res.json() as SaleReturnInvoice)
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
