import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { ProductDisassemly } from '../../../../../shared';

@Injectable()
export class ProductDisassemblyService {
  URL = 'api/ProductDisassembly';
   
   constructor(private httpRepository: RepositoryHttpService) { }
  //getDisassemly
  getDisassemly(ID:any) {
    return this.httpRepository.getData(this.URL + "/getDisassemly?ID=" + ID + "")
  }
  //getItems
  getItems() {
    return this.httpRepository.getData(this.URL + "/getItems")
  }
  //getUnitPrice
  getUnitPrice(item_ID: Number) {
    return this.httpRepository.getData(this.URL + "/getUnitPrice?item_ID=" + item_ID + "")
  }
  //getStocks
  getStocks(item_Code: Number, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getStocks?item_Code=" + item_Code + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getPriviledgedOffices
  getPriviledgedOffices() {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices")
  }
  //getDetailsByID
  getDetailsByID(disassemly_ID: Number): Observable<ProductDisassemly> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?disassemly_ID=" + disassemly_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //saveAssembly
  saveDisassemly(disassemly: any): Promise<any> {
    let body = JSON.stringify(disassemly);
  //  alert(body);
   return this.httpRepository.create(this.URL, disassemly )
      .toPromise()
      .then(res => res.json() as ProductDisassemly)
      .catch()
  }
  //updateDisassemly
  updateDisassemly(disassemly: any): Promise<any> {
    let body = JSON.stringify(disassemly);
  //   alert(body);
    return this.httpRepository.update(this.URL, disassemly )
      .toPromise()
      .then(res => res.json() as ProductDisassemly)
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
