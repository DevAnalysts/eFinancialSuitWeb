
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { systemConfiguration } from '../../../shared';


@Injectable()
export class SystemconfigurationService {

  URL = 'api/SystemConfiguration';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

  //updateData
  updateData(empc: any): Promise<any> {
    let body = JSON.stringify(empc);
    //  alert(body);
    return this.httpRepository.update(this.URL, empc )
      .toPromise()
      .then(res => res.json() as systemConfiguration)
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
