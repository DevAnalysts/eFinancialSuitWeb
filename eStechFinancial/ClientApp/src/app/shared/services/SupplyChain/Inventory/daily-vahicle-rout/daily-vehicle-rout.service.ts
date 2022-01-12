import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { DailyVehicleRout } from '../../../../../shared';
@Injectable()
export class DailyVehicleRoutService {

  URL = 'api/DailyVehicleRout';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //orderDetails
  orderDetails(goods_Supply_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/orderDetails?goods_Supply_ID=" + goods_Supply_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //searchOrderDetails
  searchVehicleRout(goods_Supply_ID: any) {
    return this.httpRepository.getData(this.URL + "/searchVehicleRout?goods_Supply_ID=" + goods_Supply_ID + "")
  }
  //IfExists
  IfExists(sale_Order_ID: any, goods_Supply_ID :any) {
    return this.httpRepository.getData(this.URL + "/IfExists?sale_Order_ID=" + sale_Order_ID + "&goods_Supply_ID=" + goods_Supply_ID + "")
  }
  //getCustomers
  getAreas(ID: any,priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getAreas?ID=" + ID+"&priviledged_Offices=" + priviledged_Offices + "")
  }
  getvehicles(ID: any,priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getvehicles?ID=" + ID+"&priviledged_Offices=" + priviledged_Offices + "")
  }
  getDrivers() {
    return this.httpRepository.getData(this.URL + "/getDrivers")
  }
  getHelpers() {
    return this.httpRepository.getData(this.URL + "/getHelpers")
  }
  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice:any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getContacts
  getContacts(Customer_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getContacts?Customer_ID=" + Customer_ID + "")
  }
  //getPendingOrder
  getOfficers(area_ID: any, date : any, vehicle_ID: any) {
    return this.httpRepository.getData(this.URL + "/getOfficers?area_ID=" + area_ID + "&date=" + date + "&vehicleID=" + vehicle_ID + "")
  }
  //getPendingOrderDetails
  getPendingOrderDetails(userCurrentOffice: any, userCurrentWarehouse:any,customer_ID: any, sale_Order_ID: any, goods_Supply_ID: any, mode: any, beforeInvoice: any) {
    return this.httpRepository.getData(this.URL + "/getPendingOrderDetails?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&customer_ID=" + customer_ID + "&sale_Order_ID=" + sale_Order_ID + "&goods_Supply_ID=" + goods_Supply_ID + "&mode=" + mode + "&beforeInvoice=" + beforeInvoice + "")
  }
  getEmp() {
    return this.httpRepository.getData(this.URL + "/getEmp")
  }
   //getCompanyTemplate 
   getCompanyTemplate(OfficeId: any, PageCode: any, IsSaleTaxInv: any) {
    return this.httpRepository.getData(this.URL + "/getCompanyTemplate?OfficeId=" + OfficeId + "&PageCode=" + PageCode + "&IsSaleTaxInv=" + IsSaleTaxInv)
  }
  //getItems
  getItems() {
    return this.httpRepository.getData(this.URL + "/getItems")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "")
  }
  getUnits() {
    return this.httpRepository.getData(this.URL + "/getUnits")
  }
  //getStocks
  getStocks(item_Code: Number) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "")
  }
  //getDetailsByID
  getDetailsByID(goods_Supply_ID: Number): Observable<DailyVehicleRout> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?goods_Supply_ID=" + goods_Supply_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //IfGDNExists
  IfGDNExists(goods_Supply_ID: any, customer_ID: any, sale_Order_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfGDNExists?goods_Supply_ID=" + goods_Supply_ID + "&customer_ID=" + customer_ID + "&sale_Order_ID=" + sale_Order_ID + "")
  }
  //cancelCheck
  cancelCheck(ID: any, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/cancelCheck?ID=" + ID + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //cancelGDN
  cancelGDN(ID: any) {
    return this.httpRepository.getData(this.URL + "/cancelGDN?ID=" + ID + "")
  }
  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
   // alert(body);
   return this.httpRepository.create(this.URL, order )
      .toPromise()
      .then(res => res.json() as DailyVehicleRout)
      .catch()
  }
  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL, order )
      .toPromise()
      .then(res => res.json() as DailyVehicleRout)
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
