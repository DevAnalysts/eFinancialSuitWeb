
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AssetRegistration } from '../../../../shared';


@Injectable()
export class AssetRegistrationService {

  URL = 'api/AssetRegistration';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getSubCategory
  getSubCategory() {
    return this.httpRepository.getData(this.URL + "/getSubCategory")
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

    //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
  //  alert(body);
     return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as AssetRegistration)
      .catch()
  }

  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    //  alert(body);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as AssetRegistration)
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
