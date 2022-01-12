
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Department } from '../../../shared';


@Injectable()
export class DepartmentService {

  URL = 'api/Department';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }

  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

  //saveData
  saveData(depart: any): Promise<any> {
    let body = JSON.stringify(depart);
    //  alert(body);
    return this.httpRepository.create(this.URL, depart )
      .toPromise()
      .then(res => res.json() as Department)
      .catch()
  }

  //updateData
  updateData(depart: any): Promise<any> {
    let body = JSON.stringify(depart);
    //  alert(body);
    return this.httpRepository.update(this.URL, depart )
      .toPromise()
      .then(res => res.json() as Department)
      .catch()
  }


  ////getSession
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
