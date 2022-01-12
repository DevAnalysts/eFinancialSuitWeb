
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { CompanySetup } from '../../../shared';


@Injectable()
export class CompanySetupService {

  URL = 'api/CompanySetup';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getDefaultCompany
  getDefaultCompany() {
    return this.httpRepository.getData(this.URL + "/getDefaultCompany");
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }
  //saveData
  saveData(C_Setup: any): Promise<any> {
    let body = JSON.stringify(C_Setup);
   // alert(body);
    return this.httpRepository.create(this.URL, C_Setup )
      .toPromise()
      .then(res => res.json() as CompanySetup)
      .catch()
  }
  //updateData
  updateData(C_Setup: any): Promise<any> {
    let body = JSON.stringify(C_Setup);
    //  alert(body);
    return this.httpRepository.update(this.URL, C_Setup )
      .toPromise()
      .then(res => res.json() as CompanySetup)
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
