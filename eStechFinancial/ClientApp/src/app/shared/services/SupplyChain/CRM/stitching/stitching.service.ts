import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Stitching } from '@shared/models/SupplyChain/CRM/stitching';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StitchingService {

  URL = 'api/Stitching';

  constructor(private httpRepository: RepositoryHttpService) { }

  //getSaleOrders
  getSaleOrders() {
    return this.httpRepository.getData(this.URL + "/getSaleOrders")
  }

  //GetDailyProductionDetails
  GetStitchingDetails(production_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/GetStitchingDetails?production_ID=" + production_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
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
  getShiftIncharge() {
    return this.httpRepository.getData(this.URL + "/getShiftIncharge")
  }
  //getIMEI
  getFourman() {
    return this.httpRepository.getData(this.URL + "/getFourman" )
  }
  //getIMEI
  getDepartment() {
    return this.httpRepository.getData(this.URL + "/getDepartment")
  }
  //getOperator
  getOperator() {
    return this.httpRepository.getData(this.URL + "/getOperator")
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
  getAllKnittingNo()
  {
    return this.httpRepository.getData(this.URL + "/getAllKnittingNo")
  }
  //getItems
  getItems(knittingID) {
    return this.httpRepository.getData(this.URL + "/getItems?knittingID=" + knittingID + "")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number, customerCategoryId: Number, allowPriceList: Boolean, userCurrentOffice: any, userCurrentWarehouse: any, customer_ID: any) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "&customerCategoryId=" + customerCategoryId + "&allowPriceList=" + allowPriceList + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&customer_ID=" + customer_ID + "")

  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }

  //getDetailsByID
  getDetailsByID(production_ID: Number): Observable<Stitching> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?production_ID=" + production_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getDetailsByID
  getKnittingDetailByID(knittingID: Number): Observable<Stitching> {
    return this.httpRepository.getData(this.URL + "/getKnittingDetailByID?knittingID=" + knittingID + "")
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

  

  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.create(this.URL + "/save", order)
      .toPromise()
      .then(res => res.json() as Stitching)
      .catch()
  }


  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    // alert(body);
    return this.httpRepository.update(this.URL, order)
      .toPromise()
      .then(res => res.json() as Stitching)
      .catch()
  }

  //update
  update(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL + "/update", order)
      .toPromise()
      .then(res => res.json() as Stitching)
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
