import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { GoodsReceive } from '../../../../../shared';

@Injectable()
export class GoodsReceiptsNoteService {


  URL = 'api/GoodsReceiptsNote';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //orderDetails
  orderDetails(ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/orderDetails?ID=" + ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //searchOrderDetails
  searchOrderDetails(purchase_Return_ID: any) {
    return this.httpRepository.getData(this.URL + "/searchOrderDetails?purchase_Return_ID=" + purchase_Return_ID + "")
  }
  //IfExists
  IfExists(purchase_Order_ID: any, goods_Receive_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?purchase_Order_ID=" + purchase_Order_ID + "&goods_Receive_ID=" + goods_Receive_ID + "")
  }
  //IfGRNExists
  IfGRNExists(goods_Receive_ID: any, supplier_ID: any, purchase_Order_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfGRNExists?goods_Receive_ID=" + goods_Receive_ID + "&supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Order_ID + "")
  }

  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getSuppliers
  getSuppliers(grn_ID: any, supplier_ID: any, priviledged_Offices: any, mode: any, beforeInvoice: any) {
    return this.httpRepository.getData(this.URL + "/getSuppliers?grn_ID=" + grn_ID + "&supplier_ID=" + supplier_ID + "&priviledged_Offices=" + priviledged_Offices + "&mode=" + mode + "&beforeInvoice=" + beforeInvoice + "")
  }

  //getContacts
  getContacts(Supplier_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getContacts?Supplier_ID=" + Supplier_ID + "")
  }
  //getPendingOrder
  getPendingOrder(priviledged_Offices: any, supplier_ID: any, purchase_Order_ID: any, mode: any, beforeInvoice: any) {
    return this.httpRepository.getData(this.URL + "/getPendingOrder?priviledged_Offices=" + priviledged_Offices + "&supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Order_ID + "&mode=" + mode + "&beforeInvoice=" + beforeInvoice + "")
  }
  //getPendingOrderDetails
  getPendingOrderDetails(userCurrentOffice: any, userCurrentWarehouse: any,supplier_ID: any, purchase_Order_ID: any, good_Receive_ID: any, mode: any, beforeInvoice: any) {
    return this.httpRepository.getData(this.URL + "/getPendingOrderDetails?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&supplier_ID=" + supplier_ID + "&purchase_Order_ID=" + purchase_Order_ID + "&good_Receive_ID=" + good_Receive_ID + "&mode=" + mode + "&beforeInvoice=" + beforeInvoice + "")
  }
  //getItems
  getItems() {
    return this.httpRepository.getData(this.URL + "/getItems")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getDetailsByID
  getDetailsByID(goods_Receive_ID: Number): Observable<GoodsReceive> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?goods_Receive_ID=" + goods_Receive_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
 //getCompanyTemplate 
 getCompanyTemplate(OfficeId: any, PageCode: any, IsSaleTaxInv: any) {
  return this.httpRepository.getData(this.URL + "/getCompanyTemplate?OfficeId=" + OfficeId + "&PageCode=" + PageCode + "&IsSaleTaxInv=" + IsSaleTaxInv)
}

  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //cancelCheck
  cancelCheck(ID: any, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/cancelCheck?ID=" + ID + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
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
