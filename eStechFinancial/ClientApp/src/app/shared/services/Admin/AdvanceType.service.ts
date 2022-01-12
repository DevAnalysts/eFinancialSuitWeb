
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AdvanceType } from '../../../shared';


@Injectable()
export class AdvanceTypeService {

  URL = 'api/AdvanceType';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getCategory
  getCategory() {
    return this.httpRepository.getData(this.URL + "/getCategory")
  }

  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

  //saveData
  saveData(T_Advance: any): Promise<any> {
    let body = JSON.stringify(T_Advance);
  //  alert(body);
    return this.httpRepository.create(this.URL, T_Advance )
      .toPromise()
      .then(res => res.json() as AdvanceType)
      .catch()
  }

  //updateData
  updateData(T_Advance: any): Promise<any> {
    let body = JSON.stringify(T_Advance);
    //  alert(body);
    return this.httpRepository.update(this.URL, T_Advance )
      .toPromise()
      .then(res => res.json() as AdvanceType)
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
