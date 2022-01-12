
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { CustomerLogBook } from '../../../../../shared';

@Injectable()
export class CustomerLogService {

  URL = 'api/CustomerLog';
   
   constructor(private httpRepository: RepositoryHttpService) { }
  //getCustomerLogBook
  getCustomerLogBook() {
    return this.httpRepository.getData(this.URL + "/getCustomerLogBook")
  }
  //getCustomerLogBookFiltered
  getCustomerLogBookFiltered(customerID: any, statusID: any) {
    return this.httpRepository.getData(this.URL + "/getCustomerLogBookFiltered?customerID=" + customerID + "&statusID=" + statusID)
  }
  //getCustomer
  getCustomer() {
    return this.httpRepository.getData(this.URL + "/getCustomer")
  }
  //getContact
  getContact(customerid: any) {
    return this.httpRepository.getData(this.URL + "/getContact?CustomerId=" + customerid)
  }
  //getStatus
  getStatus() {
    return this.httpRepository.getData(this.URL + "/getStatus")
  }
  //getCustomerLogByCustomerID
  getCustomerLogByCustomerID(customerid: any) {
    return this.httpRepository.getData(this.URL + "/getCustomerLogByCustomerID?CustomerId=" + customerid)
  }
  //getCustomerLogByID
  getCustomerLogByID(logid: any) {
    return this.httpRepository.getData(this.URL + "/getCustomerLogByID?LogId=" + logid)
  }
  //saveContact
  saveCustomerLog(customerlogbook: any): Promise<any> {
    let body = JSON.stringify(customerlogbook);
    //  alert(body);
   return this.httpRepository.create(this.URL, customerlogbook )
      .toPromise()
      .then(res => res.json() as CustomerLogBook)
      .catch()
  }
    //updateUser
  updateCustomerLog(customerlogbook: any): Promise<any> {
    let body = JSON.stringify(customerlogbook);
    //alert(body);
    return this.httpRepository.update(this.URL, customerlogbook )
      .toPromise()
      .then(res => res.json() as CustomerLogBook)
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
