import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { PurchaseReturnNote } from '../../../../../shared';

@Injectable()
export class PurchaseReturnNoteService {

  URL = 'api/PurchaseReturnNote';

  constructor(private httpRepository: RepositoryHttpService) { }

  //orderDetails
  orderDetails(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/orderDetails?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //searchOrderDetails
  searchOrderDetails(purchase_Return_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/searchOrderDetails?purchase_Return_ID=" + purchase_Return_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //IfExists
  IfExists(purchase_Return_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?purchase_Return_ID=" + purchase_Return_ID + "")
  }
  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getSuppliers
  getSuppliers(priviledged_Offices: any, supplier_ID: any, mode: any) {
    return this.httpRepository.getData(this.URL + "/getSuppliers?priviledged_Offices=" + priviledged_Offices + "&supplier_ID=" + supplier_ID + "&mode=" + mode + "")
  }
  //getContacts
  getContacts(Supplier_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getContacts?Supplier_ID=" + Supplier_ID + "")
  }
  //getItems
  getItems(Supplier_ID: Number, Invoice: Number) {
    return this.httpRepository.getData(this.URL + "/getItems?Supplier_ID=" + Supplier_ID + "&Invoice=" + Invoice + "")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "")
  }
  //getIMEI
  getIMEI(item_ID: Number, purchase_Invoice_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getIMEI?item_ID=" + item_ID + "&purchase_Invoice_ID=" + purchase_Invoice_ID + "")
  }
  //getIMEI
  getAllIMEI(orderID: Number, mode: boolean) {
    return this.httpRepository.getData(this.URL + "/getAllIMEI?orderID=" + orderID + "&mode=" + mode + "")
  }
  //changeIMEI
  changeIMEI(imei: any) {
    return this.httpRepository.getData(this.URL + "/changeIMEI?imei=" + imei + "")
  }
  //Checkimei
  checkIMEI(imei: any) {
    return this.httpRepository.getData(this.URL + "/checkIMEI?imei=" + imei + "")
  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  getItemSold(Supplier_ID: Number, item_Code: Number, Invoice: Number, userCurrentOffice: any) {
    return this.httpRepository.getData(this.URL + "/getItemSold?Supplier_ID=" + Supplier_ID + "&item_Code=" + item_Code + "&Invoice=" + Invoice + "&userCurrentOffice=" + userCurrentOffice + "")
  }
  //getDetailsByID
  getDetailsByID(purchase_Return_ID: Number): Observable<PurchaseReturnNote> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?orderID=" + purchase_Return_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //cancelOrder
  cancelOrder(ID: any, actionID: any) {
    return this.httpRepository.getData(this.URL + "/cancelOrder?ID=" + ID + "&actionID=" + actionID + "")
  }
  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.create(this.URL, order)
      .toPromise()
      .then(res => res.json() as PurchaseReturnNote)
      .catch()
  }
  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL, order)
      .toPromise()
      .then(res => res.json() as PurchaseReturnNote)
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

