import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProductAssembly } from '../../../../../shared';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
@Injectable()
export class ProductAssemblyService {

  URL = 'api/ProductAssembly';

  constructor(private httpRepository: RepositoryHttpService) { }
  //getAssembly
  getAssembly() {
    return this.httpRepository.getData(this.URL + "/getAssembly")
  }
  //getItems
  getOffices() {
    return this.httpRepository.getData(this.URL + "/getOffices")
  }
  getWarehouse(Office:any) {
    return this.httpRepository.getData(this.URL + "/getWarehouse?Office=" + Office + "")
  }
 //getItems
 getItems(Office,warehouse) {
  return this.httpRepository.getData(this.URL + "/getItems?Office=" + Office + "&warehouse=" + warehouse + "" )
}
  //getUnitPrice
  getUnitPrice(item_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "")
  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getMaterialCost
  getMaterialCost(userCurrentOffice: any, userCurrentWarehouse: any, item_Code: any, quantity: any) {
    return this.httpRepository.getData(this.URL + "/getMaterialCost?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&item_Code=" + item_Code + "&quantity=" + quantity + "")
  
  }
  getMaterialQtyForProduction(item_Code)
  {
    return this.httpRepository.getData(this.URL + "/getMaterialQtyForProduction?item_Code=" + item_Code + "")
  }
  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice:any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }
  //getDetailsByID
  getDetailsByID(consume_ID: Number): Observable<ProductAssembly> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?consume_ID=" + consume_ID + "")
      .map((res: Response) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //saveAssembly
  saveAssembly(assembly: any): Promise<any> {
    let body = JSON.stringify(assembly);
    //alert(body);
    return this.httpRepository.create(this.URL, assembly)
      .toPromise()
      .then(res => res.json() as ProductAssembly)
      .catch()
  }
  //updateAssembly
  updateAssembly(assembly: any): Promise<any> {
    let body = JSON.stringify(assembly);
    // alert(body);
    return this.httpRepository.update(this.URL, assembly)
      .toPromise()
      .then(res => res.json() as ProductAssembly)
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
