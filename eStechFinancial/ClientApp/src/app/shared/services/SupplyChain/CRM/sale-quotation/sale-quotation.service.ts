import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { saleQuotation } from '@shared/models/SupplyChain/CRM/saleQuotation';
import { Observable } from 'rxjs/Observable'; 

@Injectable()
export class SaleQuotationService {

  URL = 'api/SaleQuotation';

  constructor(private httpRepository: RepositoryHttpService) { }

  
  //searchSaleQuotations
  searchSaleQuotations(saleQuotation_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/searchSaleQuotations?sale_Quotation_ID=" + saleQuotation_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //searchDirectSaleOrders
 /*  searchDirectSaleOrders(sale_Order_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/searchDirectSaleOrders?sale_Order_ID=" + sale_Order_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  } */
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
   
  //getTaxRates
  getTaxRates() {
    return this.httpRepository.getData(this.URL + "/getTaxRates")
  }
  //getCompanyTemplate 
  getCompanyTemplate(OfficeId: any, PageCode: any, IsSaleTaxInv: any) {
    return this.httpRepository.getData(this.URL + "/getCompanyTemplate?OfficeId=" + OfficeId + "&PageCode=" + PageCode + "&IsSaleTaxInv=" + IsSaleTaxInv)
  }
  //getCustomersForSO
  getCustomersForQO(AreaID: any) {
    return this.httpRepository.getData(this.URL + "/getCustomersForQO?AreaID=" + AreaID)
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
  //getUnitPrice
  getUnitPrice(item_ID: Number, customerCategoryId: Number, allowPriceList: Boolean, userCurrentOffice: any, userCurrentWarehouse: any, customer_ID: any,unitID:any) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "&customerCategoryId=" + customerCategoryId + "&allowPriceList=" + allowPriceList + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&customer_ID=" + customer_ID + "&unitID=" + unitID +"")

  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }

  //getDetailsByID
  getDetailsByID(saleQuotation_ID: Number): Observable<saleQuotation> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?saleQuotation_ID=" + saleQuotation_ID + "")
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
  IfExists(saleQuotation_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?saleQuotation_ID=" + saleQuotation_ID + "")
  }

  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
    
  //getCustomerEmail
  getCustomerEmail(ID: any) {
    return this.httpRepository.getData(this.URL + "/getCustomerEmail?ID=" + ID + "")
  }
  //getCustomerEmail
  getCustomerNo(ID: any) {
    return this.httpRepository.getData(this.URL + "/getCustomerNo?ID=" + ID + "")
  }

   

  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.create(this.URL + "/save", order)
      .toPromise()
      .then(res => res.json() as saleQuotation)
      .catch()
  }


  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
     //alert(body);
    return this.httpRepository.update(this.URL, order)
      .toPromise()
      .then(res => res.json() as saleQuotation)
      .catch()
  }

  //update
  update(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL + "/update", order)
      .toPromise()
      .then(res => res.json() as saleQuotation)
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
