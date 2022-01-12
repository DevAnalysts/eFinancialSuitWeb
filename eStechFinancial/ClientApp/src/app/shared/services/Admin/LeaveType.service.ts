
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { LeaveType } from '../../../shared';


@Injectable()
export class LeaveTypeService {

  URL = 'api/LeaveType';
   
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
  saveData(LeaveType: any): Promise<any> {
    let body = JSON.stringify(LeaveType);
  //  alert(body);

    return this.httpRepository.create(this.URL, LeaveType )
      .toPromise()
      .then(res => res.json() as LeaveType)
      .catch()
  }
  //updateData
  updateData(LeaveType: any): Promise<any> {
    let body = JSON.stringify(LeaveType);
    //  alert(body);
    return this.httpRepository.update(this.URL, LeaveType )
      .toPromise()
      .then(res => res.json() as LeaveType)
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
