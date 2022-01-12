
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { OrderScheme } from '../../../../../shared';

@Injectable()
export class OrderSchemeService {

  URL = 'api/OrderScheme';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getItems
  getItems(userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getItems?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getArea
  getArea() {
    return this.httpRepository.getData(this.URL + "/getArea")
  }
  //getRouteWiseScheme
  getRouteWiseScheme(Area: any, Date: any) {
    return this.httpRepository.getData(this.URL + "/getRouteWiseScheme?Area=" + Area + "&Date=" + Date)
  }
  //getRouteWiseSchemes
  getRouteWiseSchemes(Area: any, Date: any) {
    return this.httpRepository.getData(this.URL + "/getRouteWiseSchemes?Area=" + Area + "&Date=" + Date)
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }
  //getSchemeDetailsByID
  getSchemeDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getSchemeDetailsByID?ID=" + ID)
  }
  //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
   return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as OrderScheme)
      .catch()
  }
  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as OrderScheme)
      .catch()
  }
  //cancelScheme
  cancelScheme(ID: any) {
    return this.httpRepository.getData(this.URL + "/cancelScheme?ID=" + ID)
  }
  //getSession
  getSession(value: any): string {
    if (typeof (Storage) !== 'undefined') { 
      if (sessionStorage.getItem(value)) {
        return sessionStorage.getItem(value);
      }

      return 'undefined';
    }
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
