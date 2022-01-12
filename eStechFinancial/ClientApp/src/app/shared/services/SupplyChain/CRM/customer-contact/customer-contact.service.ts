
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Contacts } from '../../../../../shared';

@Injectable()
export class CustomerContactService {

  URL = 'api/CustomerContact';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getContact
  getContact() {
    return this.httpRepository.getData(this.URL + "/getContact")
  }
  //getCustomer
  getCustomer() {
    return this.httpRepository.getData(this.URL + "/getCustomer")
  }
  //getGender
  getGender() {
    return this.httpRepository.getData(this.URL + "/getGender")
  }
  //getMartial
  getMartial() {
    return this.httpRepository.getData(this.URL + "/getMartial")
  }
  //getCity
  getCity() {
    return this.httpRepository.getData(this.URL + "/getCity")
  }
  //getDistrict
  getRegion(CITY_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getRegion?CITY_CODE=" + CITY_CODE)
  }
  //getProvince
  getProvince(PROVINCE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getProvince?PROVINCE_CODE=" + PROVINCE_CODE)
  }
  //getCountry
  getCountry(Country_id: any) {
    return this.httpRepository.getData(this.URL + "/getCountry?Country_id=" + Country_id)
  }
  //getDetailsByID
  getDetailsByID(Contact_ID: Number): Observable<Contacts> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?Contact_ID=" + Contact_ID + "")
      .map((res) => {
        console.log(res.json()[0]);
        return res.json()[0];

      })
      .catch(this.handleError);
  }
  //getAddressByID
  getAddressByID(Contact_ID: any) {
    return this.httpRepository.getData(this.URL + "/getAddressByID?Contact_ID=" + Contact_ID)
  }
  //saveContact
  saveContact(contact: any): Promise<any> {
    let body = JSON.stringify(contact);
    //  alert(body);
   return this.httpRepository.create(this.URL, contact )
      .toPromise()
      .then(res => res.json() as Contacts)
      .catch()
  }
    //updateUser
  updateContact(contact: any): Promise<any> {
    let body = JSON.stringify(contact);
    //alert(body);
    return this.httpRepository.update(this.URL, contact )
      .toPromise()
      .then(res => res.json() as Contacts)
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

  //getEmp(OFFICE_CODE: any) {
  //  return this.httpRepository.getData(this.URL + "/getEmp?OFFICE_CODE=" + OFFICE_CODE)
  //}
  //getOffice() {
  //  return this.httpRepository.getData(this.URL + "/getOffice")
  //}
  //getDetailsByID(user_ID: Number): Observable<Users> {
  //  return this.httpRepository.getData(this.URL + "/getDetailsByID?user_ID=" + user_ID + "")
  //    .map((res) => {
  //      console.log(res.json()[0]);
  //      return res.json()[0];

  //    })
  //    .catch(this.handleError);
  //}

  ////saveUser
  //saveUser(user: any): Promise<any> {
  //  let body = JSON.stringify(user);
  ////  alert(body);
  // return this.httpRepository.create(this.URL, user )
  //    .toPromise()
  //    .then(res => res.json() as Users)
  //    .catch()
  //}
  ////updateUser
  //updateUser(user: any): Promise<any> {
  //  let body = JSON.stringify(user);
  //  alert(body);
  //  return this.httpRepository.update(this.URL, user )
  //    .toPromise()
  //    .then(res => res.json() as Users)
  //    .catch()
  //}
  //getSession
}
