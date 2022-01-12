
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Users } from '../../../../shared';

@Injectable()
export class UserService {

  URL = 'api/User';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getUsers
  getUsers() {
    return this.httpRepository.getData(this.URL + "/getUsers")
  }
  getEmp(OFFICE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getEmp?OFFICE_CODE=" + OFFICE_CODE)
  }
  getOffice() {
    return this.httpRepository.getData(this.URL + "/getOffice")
  }
  getDetailsByID(user_ID: Number): Observable<Users> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?user_ID=" + user_ID + "")
      .map((res) => {
        console.log(res.json()[0]);
        return res.json()[0];

      })
      .catch(this.handleError);
  }

  //saveUser
  saveUser(user: any): Promise<any> {
    let body = JSON.stringify(user);
  //  alert(body);
   return this.httpRepository.create(this.URL, user )
      .toPromise()
      .then(res => res.json() as Users)
      .catch()
  }
  //updateUser
  updateUser(user: any): Promise<any> {
    let body = JSON.stringify(user);
    //alert(body);
    return this.httpRepository.update(this.URL, user )
      .toPromise()
      .then(res => res.json() as Users)
      .catch()
  }
  setActive(userid: any) {
    return this.httpRepository.getData(this.URL + "/setActive?UserId=" + userid);
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
