
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Province } from '../../../shared';

@Injectable()
export class ProvinceService {

  URL = 'api/Province';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getCountry
  getCountry() {
    return this.httpRepository.getData(this.URL + "/getCountry")
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

   //saveData
  saveData(province: any): Promise<any> {
    let body = JSON.stringify(province);
   //alert(body);
    return this.httpRepository.create(this.URL, province )
      .toPromise()
      .then(res => res.json() as Province)
      .catch()
  }
  
  //updateData
  updateData(pro: any): Promise<any> {
    let body = JSON.stringify(pro);
   // alert(body);
    return this.httpRepository.update(this.URL, pro )
      .toPromise()
      .then(res => res.json() as Province)
      .catch()
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
