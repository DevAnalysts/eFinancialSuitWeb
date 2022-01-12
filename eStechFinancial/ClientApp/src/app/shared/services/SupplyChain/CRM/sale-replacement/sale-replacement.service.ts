import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { SaleReplacement } from '../../../../../shared';


@Injectable()
export class SaleReplacementService {

  URL = 'api/SaleReplacement';   
   constructor(private httpRepository: RepositoryHttpService) { }

  //orderDetails
  orderDetails(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/orderDetails?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //searchOrderDetails
  searchOrderDetails(sale_Replacement_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/searchOrderDetails?sale_Replacement_ID=" + sale_Replacement_ID + "?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getCustomers
  getCustomers(priviledged_Offices: any, customer_ID: any, mode: any) {
    return this.httpRepository.getData(this.URL + "/getCustomers?priviledged_Offices=" + priviledged_Offices + "&customer_ID=" + customer_ID + "&mode=" + mode + "")
  }
  //getContacts
  getContacts(Customer_ID: any) {
    return this.httpRepository.getData(this.URL + "/getContacts?Customer_ID=" + Customer_ID + "")
  }
  //getItems
  getItems(Customer_ID: Number, Invoice: Number, userCurrentOffice: any) {
    return this.httpRepository.getData(this.URL + "/getItems?Customer_ID=" + Customer_ID + "&Invoice=" + Invoice + "&userCurrentOffice=" + userCurrentOffice + "")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number, customerCategoryId: Number, allowPriceList: Boolean, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "&customerCategoryId=" + customerCategoryId + "&allowPriceList=" + allowPriceList + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
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
  getDetailsByID(sale_Replacement_ID: Number): Observable<SaleReplacement> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?orderID=" + sale_Replacement_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //IfExists
  IfExists(sale_Replacement_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?sale_Replacement_ID=" + sale_Replacement_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //saveOrder
  saveOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
   return this.httpRepository.create(this.URL, order )
      .toPromise()
      .then(res => res.json() as SaleReplacement)
      .catch()
  }
  //updateOrder
  updateOrder(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.update(this.URL, order )
      .toPromise()
      .then(res => res.json() as SaleReplacement)
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

