import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { saleOrder } from '../../../../../shared';

@Injectable()
export class SaleOrderService {

  URL = 'api/SaleOrder';

  constructor(private httpRepository: RepositoryHttpService) { }

  //getSaleOrders
  getSaleOrders() {
    return this.httpRepository.getData(this.URL + "/getSaleOrders")
  }

  //searchSaleOrders
  searchSaleOrders(sale_Order_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/searchSaleOrders?sale_Order_ID=" + sale_Order_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //searchDirectSaleOrders
  searchDirectSaleOrders(sale_Order_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/searchDirectSaleOrders?sale_Order_ID=" + sale_Order_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }

  //getSaleOfficers
  getSaleOfficers(userPrivilegedOffice: any, designations: any) {
    return this.httpRepository.getData(this.URL + "/getSaleOfficers?userPrivilegedOffice=" + userPrivilegedOffice + "&designations=" + designations)
  }
  //getAreaEnableStatus
  getAreaEnableStatus() {
    return this.httpRepository.getData(this.URL + "/getAreaEnableStatus")
  }
  //getArea
  getArea() {
    return this.httpRepository.getData(this.URL + "/getArea")
  }
  //getIMEI
  getIMEI(imei: string) {
    return this.httpRepository.getData(this.URL + "/getIMEI?imei=" + imei + "")
  }
  //getIMEI
  getAllIMEI(sale_Invoice_ID: Number, mode: boolean,pageCode:any) {
    return this.httpRepository.getData(this.URL + "/getAllIMEI?orderID=" + sale_Invoice_ID + "&mode=" + mode + "&pageCode="+pageCode)
  }
  //getTaxRates
  getTaxRates() {
    return this.httpRepository.getData(this.URL + "/getTaxRates")
  }
  //getCompanyTemplate 
  getCompanyTemplate(OfficeId: any, PageCode: any, IsSaleTaxInv: any) {
    return this.httpRepository.getData(this.URL + "/getCompanyTemplate?OfficeId=" + OfficeId + "&PageCode=" + PageCode + "&IsSaleTaxInv=" + IsSaleTaxInv)
  }
  //getCustomersForSO
  getCustomersForSO(AreaID: any) {
    return this.httpRepository.getData(this.URL + "/getCustomersForSO?AreaID=" + AreaID)
  }
  //getCustomers
  getCustomers() {
    return this.httpRepository.getData(this.URL + "/getCustomers")
  }
  //getRefCustomers
  getRefCustomers(customer_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getRefCustomers?customer_ID=" + customer_ID + "")
  }
  //getContacts
  getContacts(customer_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getContacts?customer_ID=" + customer_ID + "")
  }
  //getItems
  getItems() {
    return this.httpRepository.getData(this.URL + "/getItems")
  }
  getUnits(item_Code: Number) {
    return this.httpRepository.getData(this.URL + "/getUnits?item_Code=" + item_Code + "")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number, customerCategoryId: Number, allowPriceList: Boolean, userCurrentOffice: any, userCurrentWarehouse: any, customer_ID: any, unitID) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "&customerCategoryId=" + customerCategoryId + "&allowPriceList=" + allowPriceList + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&customer_ID=" + customer_ID + "&unitID=" + unitID + "")

  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }

  //getDetailsByID
  getDetailsByID(sale_Order_ID: Number): Observable<saleOrder> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?sale_Order_ID=" + sale_Order_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getDetailsByID
  getOrderIDByInvoiceID(invoice_ID: Number): Observable<saleOrder> {
    return this.httpRepository.getData(this.URL + "/getOrderIDByInvoiceID?invoice_ID=" + invoice_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getPayments
  getPayments() {
    return this.httpRepository.getData(this.URL + "/getPayments")
  }
  //getPaymentMethods
  getPaymentMethods() {
    return this.httpRepository.getData(this.URL + "/getPaymentMethods")
  }
  //IfExists
  IfExists(sale_Order_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?sale_Order_ID=" + sale_Order_ID + "")
  }

  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //cancelOrder
  cancelOrder(ID: any, actionID: any) {
    return this.httpRepository.getData(this.URL + "/cancelOrder?ID=" + ID + "&actionID=" + actionID + "")
  }
    //cancelOrders
    cancelOrders(ID: any, actionID: any) {
      return this.httpRepository.getData(this.URL + "/cancelOrders?ID=" + ID + "&actionID=" + actionID + "")
    }
  //cancelScheme
  cancelScheme(ID: any) {
    return this.httpRepository.getData(this.URL + "/cancelScheme?ID=" + ID + "")
  }
  //getCustomerEmail
  getCustomerEmail(ID: any) {
    return this.httpRepository.getData(this.URL + "/getCustomerEmail?ID=" + ID + "")
  }
  //getCustomerEmail
  getCustomerNo(ID: any) {
    return this.httpRepository.getData(this.URL + "/getCustomerNo?ID=" + ID + "")
  }

  getWANumbAndMsgTemplate(ID: any) {
    return this.httpRepository.getData(this.URL + "/getWANumbAndMsgTemplate?ID=" + ID + "")
  }

  ////saveOrder
  //saveOrder(order: any): Promise<any> {
  //  let body = JSON.stringify(order);
  //  //  alert(body);
  // return this.httpRepository.create(this.URL, order )
  //    .toPromise()
  //    .then(res => res.json() as saleOrder)
  //    .catch()
  //}

  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.create(this.URL + "/save", order)
      .toPromise()
      .then(res => res.json() as saleOrder)
      .catch()
  }


  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    // alert(body);
    return this.httpRepository.update(this.URL, order)
      .toPromise()
      .then(res => res.json() as saleOrder)
      .catch()
  }

  //update
  update(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL + "/update", order)
      .toPromise()
      .then(res => res.json() as saleOrder)
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
