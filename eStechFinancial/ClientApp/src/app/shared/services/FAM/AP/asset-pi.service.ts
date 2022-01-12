import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AssetPI } from '../../../../shared';

@Injectable()
export class AssetPIService {
  url = 'api/AssetPI';
  
  constructor(private httpRepository: RepositoryHttpService) { }
  //getGrid
  getGrid(Query:any,priviledged_Offices:any) {
    return this.httpRepository.getData(this.url + "/getGrid?Query=" + Query+ "&priviledged_Offices="+priviledged_Offices)
  }
  //////searchGrid
  ////searchGrid(Query: any) {
  ////  return this.httpRepository.getData(this.url + "/searchGrid?Query=" + Query + "")
  ////}
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(ID: Number): Observable<AssetPI> {
    return this.httpRepository.getData(this.url + "/getInvoiceDetailsByID?ID=" + ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getPendingSupplier
  getPendingSupplier(priviledged_Offices: any, supplier_ID: any, mode: any, allowInvoice:any) {
    return this.httpRepository.getData(this.url + "/getPendingSupplier?priviledged_Offices=" + priviledged_Offices + "&supplier_ID=" + supplier_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "")
  }
  //getPendingSupplier
  getPendingOrder(priviledged_Offices: any, supplier_ID: any, purchase_Invoice_ID: any, mode: any, allowInvoice: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrder?priviledged_Offices=" + priviledged_Offices + "&supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Invoice_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "")
  }
  //getPendingOrderDetails
  getPendingOrderDetails(supplier_ID: any, purchase_Order_ID: any, purchase_Invoice_ID: any, mode: any, allowInvoice: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrderDetails?supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Order_ID + "&purchase_Invoice_ID=" + purchase_Invoice_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "")
  }
  //////IfPaymentExists
  ////IfPaymentExists(purchase_Invoice_ID: any) {
  ////  return this.httpRepository.getData(this.url + "/IfPaymentExists?purchase_Invoice_ID=" + purchase_Invoice_ID + "")
  ////}
  ////
  //////IfExists
  ////IfExists(purchase_Order_ID: any) {
  ////    return this.httpRepository.getData(this.url + "/IfExists?purchase_Order_ID=" + purchase_Order_ID + "")
  ////}
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
      .then(res => res.json() as AssetPI)
      .catch()
  }
  //updateInvoice
  updateInvoice(invoice: any): Promise<any> {
    let body = JSON.stringify(invoice);
  // alert(body);
    return this.httpRepository.update(this.url, invoice )
      .toPromise()
      .then(res => res.json() as AssetPI)
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


