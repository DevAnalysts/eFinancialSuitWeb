
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { UserRoles } from '../../../../shared';

@Injectable()
export class UserRoleService {

  URL = 'api/userrole';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getUserRoles
  getUserRoles() {
    return this.httpRepository.getData(this.URL + "/getUserRoles")
  }
  //getOffice
  getOffice() {
    return this.httpRepository.getData(this.URL + "/getOffice")
  }

  //getEmp
  getUsers(OFFICE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getUsers?OFFICE_CODE=" + OFFICE_CODE)
  }
  //getRole
  getRole() {
    return this.httpRepository.getData(this.URL + "/getRole")
  }
  //getUserOffice
  getUserOffice() {
    return this.httpRepository.getData(this.URL + "/getUserOffice")
  }
  //saveUserRoles
  saveUserRoles(userroles: any): Promise<any> {
    let body = JSON.stringify(userroles);
    //  alert(body);
   return this.httpRepository.create(this.URL, userroles )
      .toPromise()
      .then(res => res.json() as UserRoles)
      .catch()
  }
  //getUserRolesByID
  getUserRolesByID(useR_ID: Number): Observable<UserRoles> {
    return this.httpRepository.getData(this.URL + "/getUserRolesByID?id=" + useR_ID + "")
      .map((res) => {
        console.log(res.json()[0]);
        return res.json()[0];

      })
      .catch(this.handleError);
  }
    //updateUserRoles
  updateUserRoles(userroles: any): Promise<any> {
    let body = JSON.stringify(userroles);
   // alert(body);
    return this.httpRepository.update(this.URL, userroles )
      .toPromise()
      .then(res => res.json() as UserRoles)
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
