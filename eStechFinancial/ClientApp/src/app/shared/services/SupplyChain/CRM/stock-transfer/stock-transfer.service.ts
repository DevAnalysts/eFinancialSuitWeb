import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { stockTransfer } from '@shared/models/SupplyChain/CRM/stockTransfer';
import { Observable } from 'rxjs/Observable';
import { saleOrder } from '../../../..';

@Injectable()
export class StockTransferService {

  URL = 'api/StockTransfer';

  constructor(private httpRepository: RepositoryHttpService) { }

  //getSaleOrders
  getSaleOrders() {
    return this.httpRepository.getData(this.URL + "/getSaleOrders")
  }

  //searchStockTransfer
  searchStockTransfer(stock_Trans_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/searchStockTransfer?stock_Trans_ID=" + stock_Trans_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
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
  //getCompanyTemplate 
  getCompanyTemplate(OfficeId: any, PageCode: any, IsSaleTaxInv: any) {
    return this.httpRepository.getData(this.URL + "/getCompanyTemplate?OfficeId=" + OfficeId + "&PageCode=" + PageCode + "&IsSaleTaxInv=" + IsSaleTaxInv)
  }
  
  //getItems
  getItems(from_Office,from_Warehouse) {
    return this.httpRepository.getData(this.URL + "/getItems?from_Office=" + from_Office + "&from_warehouse=" + from_Warehouse + "" )
  }
   //getItems
   getOffices() {
    return this.httpRepository.getData(this.URL + "/getOffices")
  }
   //getItems
   getWarehouse(from_Office:any) {
    return this.httpRepository.getData(this.URL + "/getWarehouse?from_Office=" + from_Office + "")
  }
   //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
    //DeleteStockItem
    DeleteStockItem(item_Code: Number, from_Office:any,from_Warehouse: any, to_Office: any,to_Warehouse:any,stock_Detail_ID:any) {
      return this.httpRepository.getData(this.URL + "/DeleteStockItem?item_Code=" + item_Code +  "&from_Office=" + from_Office + "&from_Warehouse=" + from_Warehouse + "&to_Office=" + to_Office +"&to_Warehouse=" + to_Warehouse + "&stock_Detail_ID=" + stock_Detail_ID + "")
    }
  //getDetailsByID
  getDetailsByID(stock_Trans_ID: Number): Observable<stockTransfer> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?stock_Trans_ID=" + stock_Trans_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  
  //IfExists
  IfExists(sale_Order_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?sale_Order_ID=" + sale_Order_ID + "")
  }

  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  } 

  //saveOrder
  saveStock(order: any): Promise<any> {
    let body = JSON.stringify(order);
    return this.httpRepository.create(this.URL + "/save", order)
      .toPromise()
      .then(res => res.json() as saleOrder)
      .catch()
  }


  //updateOrder
  updateStock(order: any): Promise<any> {
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
