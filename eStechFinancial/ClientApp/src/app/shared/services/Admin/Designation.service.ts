
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Designation } from '../../../shared';


@Injectable()
export class DesignationService {

  URL = 'api/Designation';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getDeparment
  getDeparment() {
    return this.httpRepository.getData(this.URL + "/getDeparment")
  }


  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

  //saveData
  saveData(desig: any): Promise<any> {
    let body = JSON.stringify(desig);
    //  alert(body);
    return this.httpRepository.create(this.URL, desig )
      .toPromise()
      .then(res => res.json() as Designation)
      .catch()
  }

  //updateData
  updateData(desig: any): Promise<any> {
    let body = JSON.stringify(desig);
    //  alert(body);
    return this.httpRepository.update(this.URL, desig )
      .toPromise()
      .then(res => res.json() as Designation)
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
