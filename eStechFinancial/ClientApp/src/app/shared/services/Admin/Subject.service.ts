
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from '../../../shared';

@Injectable()
export class SubjectService {

  URL = 'api/Subject';
   
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
  saveData(subject: any): Promise<any> {
    let body = JSON.stringify(subject);
  //  alert(body);
    return this.httpRepository.create(this.URL, subject )
      .toPromise()
      .then(res => res.json() as Subject)
      .catch()
  }

  //updateData
  updateData(subject: any): Promise<any> {
    let body = JSON.stringify(subject);
    //  alert(body);
    return this.httpRepository.update(this.URL, subject )
      .toPromise()
      .then(res => res.json() as Subject)
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
