import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Budgeting } from '@shared/models/SupplyChain/CRM/Budgeting';
import { saleOrderContractMain } from '@shared/models/SupplyChain/CRM/saleOrderContractMain';
import { Observable } from 'rxjs/Observable';
import { Customers } from '../../../../../shared';

@Injectable()
export class BudgetingService {

  URL = 'api/Budgeting';

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
  getContractNo()
  {
    return this.httpRepository.getData(this.URL + "/getContractNo")
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
  getItems(saleorderid: any) {
    return this.httpRepository.getData(this.URL + "/getItems?id=" + saleorderid + "")
  }
  getAllItems() {
    return this.httpRepository.getData(this.URL + "/getAllItems")
  }
  getOrderQty(item_Code, sale_Order_ID)
  {
    return this.httpRepository.getData(this.URL + "/getOrderQty?item_Code=" + item_Code + "&sale_Order_ID=" + sale_Order_ID + "")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number, customerCategoryId: Number, allowPriceList: Boolean, userCurrentOffice: any, userCurrentWarehouse: any, customer_ID: any) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "&customerCategoryId=" + customerCategoryId + "&allowPriceList=" + allowPriceList + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&customer_ID=" + customer_ID + "")

  }
  getCustomerCode(id)
  {
    return this.httpRepository.getData(this.URL + "/getCustomerCode?id=" + id + "")
  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
   //getDetailsByID
   getDetailsByID(budgeting_ID: Number): Observable<Budgeting> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?sale_Order_ID=" + budgeting_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getContractDetailsByID
  getContractDetailsByID(sale_Order_ID: Number): Observable<saleOrderContractMain> {
    return this.httpRepository.getData(this.URL + "/getContractDetailsByID?sale_Order_ID=" + sale_Order_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getOrderIDByInvoiceID
  getOrderIDByInvoiceID(invoice_ID: Number): Observable<saleOrderContractMain> {
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
  getAllContractNo()
  {
    return this.httpRepository.getData(this.URL + "/getAllContractNo")
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
      .then(res => res.json() as saleOrderContractMain)
      .catch()
  }


  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    // alert(body);
    return this.httpRepository.update(this.URL, order)
      .toPromise()
      .then(res => res.json() as saleOrderContractMain)
      .catch()
  }

  //update
  update(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL + "/update", order)
      .toPromise()
      .then(res => res.json() as saleOrderContractMain)
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
