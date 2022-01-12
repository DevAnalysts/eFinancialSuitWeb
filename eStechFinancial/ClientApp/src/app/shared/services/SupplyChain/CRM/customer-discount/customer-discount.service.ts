
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable'; 

@Injectable()
export class CustomerDiscountService {

  URL = 'api/CustomerDiscount';
   
   constructor(private httpRepository: RepositoryHttpService) { }
  //getModels
  getModels(customerid: any) {
    return this.httpRepository.getData(this.URL + "/getModels?customerid=" + customerid)
  }

 
  
  //saveData
  saveData(abc: any, customerid:any): Promise<any[]> {
    let body = JSON.stringify(abc);
    return this.httpRepository.create(this.URL + "?customerid=" + customerid, abc )
      .toPromise()
      .then(res => res.json() as any[])
      .catch()
  }
  
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
