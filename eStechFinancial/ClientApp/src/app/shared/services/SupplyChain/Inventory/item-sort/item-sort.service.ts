
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { ItemSort } from '../../../../../shared';

@Injectable()
export class ItemSortService {

  URL = 'api/ItemSort';
   
   constructor(private httpRepository: RepositoryHttpService) { }


  //getItem
  getItem() {
    return this.httpRepository.getData(this.URL + "/getItem")
  }
  //changeCustomerStatus
  changeCustomerStatus(ID: any) {
    return this.httpRepository.getData(this.URL + "/changeCustomerStatus?ID=" + ID)
  }
  //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
   return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as ItemSort)
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
