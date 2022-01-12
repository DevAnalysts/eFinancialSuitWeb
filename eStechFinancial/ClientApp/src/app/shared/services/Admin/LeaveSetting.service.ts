
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { LeaveSetting } from '../../../shared';


@Injectable()
export class LeaveSettingService {

  URL = 'api/LeaveSetting';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getLeaveType
  getLeaveType() {
    return this.httpRepository.getData(this.URL + "/getLeaveType")
  }
  //getCategory
  getCategory() {
    return this.httpRepository.getData(this.URL + "/getCategory")
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" +ID)
  }
  //saveData
  saveData(S_Leaves: any): Promise<any> {
    let body = JSON.stringify(S_Leaves);
  //  alert(body);
    return this.httpRepository.create(this.URL, S_Leaves )
      .toPromise()
      .then(res => res.json() as LeaveSetting)
      .catch()
  }
  //updateData
  updateData(S_Leaves: any): Promise<any> {
    let body = JSON.stringify(S_Leaves);
    //  alert(body);
    return this.httpRepository.update(this.URL, S_Leaves )
      .toPromise()
      .then(res => res.json() as LeaveSetting)
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
