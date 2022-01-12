import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { GoodsReceive } from '../../../../shared';

@Injectable()
export class AssetGRNService {


  URL = 'api/AssetGRN';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(Query: any,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?Query=" + Query + "&priviledged_Offices="+priviledged_Offices)
  }

  //////IfExists
  ////IfExists(ID: any) {
  ////  return this.httpRepository.getData(this.URL + "/IfExists?ID=" + ID + "")
  ////}
  //getPriviledgedOffices
  getPriviledgedOffices(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?priviledged_Offices="+priviledged_Offices)
  }
  //getSuppliers
  getSuppliers(grn_ID: any, supplier_ID: any, priviledged_Offices: any, mode: any, beforeInvoice: any) {
    return this.httpRepository.getData(this.URL + "/getSuppliers?grn_ID=" + grn_ID + "&supplier_ID=" + supplier_ID + "&priviledged_Offices=" + priviledged_Offices + "&mode=" + mode + "&beforeInvoice=" + beforeInvoice + "")
  }

  //getContacts
  getContacts(ID: Number) {
    return this.httpRepository.getData(this.URL + "/getContacts?Supplier_ID=" + ID + "")
  }
  //getPendingOrder
  getPendingOrder(priviledged_Offices: any, supplier_ID: any, purchase_Order_ID: any, mode: any, beforeInvoice: any) {
    return this.httpRepository.getData(this.URL + "/getPendingOrder?priviledged_Offices=" + priviledged_Offices + "&supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Order_ID + "&mode=" + mode + "&beforeInvoice=" + beforeInvoice + "")
  }
  //getPendingOrderDetails
  getPendingOrderDetails(supplier_ID: any, purchase_Order_ID: any, good_Receive_ID: any, mode: any, beforeInvoice: any) {
    return this.httpRepository.getData(this.URL + "/getPendingOrderDetails?supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Order_ID + "&good_Receive_ID=" + good_Receive_ID + "&mode=" + mode + "&beforeInvoice=" + beforeInvoice + "")
  }
  //getItems
  getItems() {
    return this.httpRepository.getData(this.URL + "/getItems")
  }
  //////getUnitPrice
  ////getUnitPrice(item_ID: Number) {
  ////  return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "")
  ////}
  //////getStocks
  ////getStocks(item_Code: Number) {
  ////  return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "")
  ////}
  //getDetailsByID
  getDetailsByID(ID: Number): Observable<GoodsReceive> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //////guidExist
  ////guidExist(guid: any) {
  ////  return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  ////}
  //////cancelCheck
  ////cancelCheck(ID: any) {
  ////  return this.httpRepository.getData(this.URL + "/cancelCheck?ID=" + ID + "")
  ////}
  //cancelGRN
  cancelGRN(ID: any) {
    return this.httpRepository.getData(this.URL + "/cancelGRN?ID=" + ID + "")
  }
  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
     return this.httpRepository.create(this.URL, order )
      .toPromise()
      .then(res => res.json() as GoodsReceive)
      .catch()
  }
  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL, order )
      .toPromise()
      .then(res => res.json() as GoodsReceive)
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
