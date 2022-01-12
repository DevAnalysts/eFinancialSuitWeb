import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { SaleReturnNote } from '../../../../../shared';


@Injectable()
export class SaleReturnNoteService {
  URL = 'api/SaleReturnNote';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //orderDetails
  orderDetails(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/orderDetails?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //searchOrderDetails
  searchOrderDetails(sale_Return_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/searchOrderDetails?sale_Return_ID=" + sale_Return_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getCustomers
  getCustomers(priviledged_Offices: any, customer_ID: any, mode: any, areaid: any) {
    return this.httpRepository.getData(this.URL + "/getCustomers?priviledged_Offices=" + priviledged_Offices + "&customer_ID=" + customer_ID + "&mode=" + mode + "&areaid=" + areaid + "")
  }
  //getContacts
  getContacts(Customer_ID: any) {
    return this.httpRepository.getData(this.URL + "/getContacts?Customer_ID=" + Customer_ID + "")
  }
    //getIMEI
    getAllIMEI(orderID: Number, mode: boolean) {
      return this.httpRepository.getData(this.URL + "/getAllIMEI?orderID=" + orderID + "&mode=" + mode + "")
    }
  //getIMEI
  getIMEI(item_ID: Number, sale_Invoice_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getIMEI?item_ID=" + item_ID + "&sale_Invoice_ID=" + sale_Invoice_ID + "")
  }
  //getArea
  getArea() {
    return this.httpRepository.getData(this.URL + "/getArea")
  }
  //getItems
  getItems(Customer_ID: Number, Invoice: Number, userCurrentOffice: any) {
    return this.httpRepository.getData(this.URL + "/getItems?Customer_ID=" + Customer_ID + "&Invoice=" + Invoice + "&userCurrentOffice=" + userCurrentOffice + "")
  }
    //changeIMEI
    changeIMEI(imei: any) {
      return this.httpRepository.getData(this.URL + "/changeIMEI?imei=" + imei + "")
    }
  //getUnitPrice
  getUnitPrice(item_ID: Number, customerCategoryId: Number, allowPriceList: Boolean, userCurrentOffice: any, userCurrentWarehouse: any, Customer_ID: any, unitID:any) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "&customerCategoryId=" + customerCategoryId + "&allowPriceList=" + allowPriceList + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&Customer_ID=" + Customer_ID + "&unitID=" + unitID + "")
  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getItemSold
  getItemSold(Customer_ID: Number, item_Code: Number, Invoice: Number, userCurrentOffice: any) {
    return this.httpRepository.getData(this.URL + "/getItemSold?Customer_ID=" + Customer_ID + "&item_Code=" + item_Code + "&Invoice=" + Invoice + "&userCurrentOffice=" + userCurrentOffice + "")
  }
  //getDetailsByID
  getDetailsByID(sale_Return_ID: Number): Observable<SaleReturnNote> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?orderID=" + sale_Return_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //IfExists
  IfExists(sale_Return_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?sale_Return_ID=" + sale_Return_ID + "")
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
      .then(res => res.json() as SaleReturnNote)
      .catch()
  }
  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL, order)
      .toPromise()
      .then(res => res.json() as SaleReturnNote)
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

