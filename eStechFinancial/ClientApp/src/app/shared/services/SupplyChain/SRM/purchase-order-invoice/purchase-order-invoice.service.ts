import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { purchaseOrder } from '../../../..';


@Injectable()
export class PurchaseOrderInvoiceService {

  orderurl = 'api/PurchaseOrder';

  constructor(private httpRepository: RepositoryHttpService) { }


  //getCompanyTemplate 
  getCompanyTemplate(OfficeId: any, PageCode: any, AllowTaxOnPurchase: any) {
    return this.httpRepository.getData(this.orderurl + "/getCompanyTemplate?OfficeId=" + OfficeId + "&PageCode=" + PageCode + "&AllowTaxOnPurchase=" + AllowTaxOnPurchase)
  }

  //orderDetails
  orderDetails() {
    return this.httpRepository.getData(this.orderurl + "/orderDetails")
  }
  //searchOrderDetails
  searchOrderDetails(purchase_Order_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.orderurl + "/searchOrderDetails?purchase_Order_ID=" + purchase_Order_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getWarranty
  getWarranty() {
    return this.httpRepository.getData(this.orderurl + "/getWarranty")
  }
  //getColor
  getColor() {
    return this.httpRepository.getData(this.orderurl + "/getColor")
  }
  //IfExists
  IfExists(purchase_Order_ID: any) {
    return this.httpRepository.getData(this.orderurl + "/IfExists?purchase_Order_ID=" + purchase_Order_ID + "")
  }
   //IfSold
   IfSold(purchase_Order_ID: any){
    return this.httpRepository.getData(this.orderurl + "/IfSold?purchase_Order_ID=" + purchase_Order_ID + "")
  }
  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.orderurl + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getPurchaseOfficers
  getPurchaseOfficers(userPrivilegedOffice: any, designations: any) {
    return this.httpRepository.getData(this.orderurl + "/getPurchaseOfficers?userPrivilegedOffice=" + userPrivilegedOffice + "&designations=" + designations)
  }
  //getSuppliers
  getSuppliers() {
    return this.httpRepository.getData(this.orderurl + "/getSuppliers")
  }


  //getTaxRates
  getTaxRates() {
    return this.httpRepository.getData(this.orderurl + "/getTaxRates")
  }
  //getContacts
  getContacts(Supplier_ID: Number) {
    return this.httpRepository.getData(this.orderurl + "/getContacts?Supplier_ID=" + Supplier_ID + "")
  }
  //getSuppliersNo
  getSuppliersNo(ID: number) {
    return this.httpRepository.getData(this.orderurl + "/getSuppliers?ID=" + ID)
  }
  //getItems
  getItems() {
    return this.httpRepository.getData(this.orderurl + "/getItems")
  }
  //getIMEI
  getIMEI(imei: string) {
    return this.httpRepository.getData(this.orderurl + "/getIMEI?imei=" + imei + "")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.orderurl + "/getUnitPrice?item_ID=" + item_ID + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getPayments
  getPayments() {
    return this.httpRepository.getData(this.orderurl + "/getPayments")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.orderurl + "/guidExist?guid=" + guid + "")
  }
  //cancelOrder
  cancelOrder(ID: any, actionID: any) {
    return this.httpRepository.getData(this.orderurl + "/cancelOrder?ID=" + ID + "&actionID=" + actionID + "")
  }
  //getSupplierEmail
  getSupplierEmail(ID: any) {
    return this.httpRepository.getData(this.orderurl + "/getSupplierEmail?ID=" + ID + "")
  }
  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    // alert(body);
    return this.httpRepository.create(this.orderurl, order)
      .toPromise()
      .then(res => res.json() as purchaseOrder)
      .catch()
  }
  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    // alert(body);
    return this.httpRepository.update(this.orderurl, order)
      .toPromise()
      .then(res => res.json() as purchaseOrder)
      .catch()
  }
  //update
  update(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.orderurl + "/update", order)
      .toPromise()
      .then(res => res.json() as purchaseOrder)
      .catch()
  }
  //getIMEI
  getAllIMEI(orderID: Number, mode: boolean,pageCode:any) {
    return this.httpRepository.getData(this.orderurl + "/getAllIMEI?orderID=" + orderID + "&mode=" + mode + "&pageCode="+pageCode)
  }
  //getDetailsByID
  getDetailsByID(purchase_Order_ID: Number, userCurrentOffice: any, userCurrentWarehouse: any): Observable<purchaseOrder> {
    return this.httpRepository.getData(this.orderurl + "/getDetailsByID?orderID=" + purchase_Order_ID + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
      .map((res) => {

        return res.json()[0];
      })
      .catch(this.handleError);
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

