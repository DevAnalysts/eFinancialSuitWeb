
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Bank } from '../../../shared';


@Injectable()
export class BankService {

  URL = 'api/Bank';
   
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
  saveData(Bank: any): Promise<any> {
    let body = JSON.stringify(Bank);
    //  alert(body);
    return this.httpRepository.create(this.URL, Bank )
      .toPromise()
      .then(res => res.json() as Bank)
      .catch()
  }

  //updateData
  updateData(Bank: any): Promise<any> {
    let body = JSON.stringify(Bank);
    //  alert(body);
    return this.httpRepository.update(this.URL, Bank )
      .toPromise()
      .then(res => res.json() as Bank)
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
