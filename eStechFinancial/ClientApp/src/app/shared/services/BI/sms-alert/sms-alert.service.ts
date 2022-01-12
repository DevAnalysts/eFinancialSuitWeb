
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SmsAlert ,SMSMessage} from '@shared/models';
import { RepositoryService } from '@services/repository.service';
 
 

@Injectable()
export class SmsAlertService {

  URL = 'api/SmsAlert';
  constructor(private repository: RepositoryService) { }

  //getGrid
  getGrid() {
    return this.repository.getData(this.URL + "/getGrid")
  }
 
  //getCategory
  getCategory() {
    return this.repository.getData(this.URL + "/getCategory")
  }

  getMessageType() {
    return this.repository.getData(this.URL + "/getMessageType")
  }
  
  //getTemplate
  getTemplate() {
    return this.repository.getData(this.URL + "/getTemplate")
  }

  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.repository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

   //sendSms
   sendSms(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    
    return this.repository.create(this.URL+ "/sendSms", abc)
      .toPromise()
      .then(res => res as SMSMessage)
      .catch()
  }
  //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.repository.create(this.URL, abc)
      .toPromise()
      .then(res => res as SmsAlert)
      .catch()
  }
  //saveMessage
  saveMessage(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.repository.create(this.URL + "/saveMessage", abc)
      .toPromise()
      .then(res => res as SmsAlert)
      .catch()
  }
  //getMessage
  getMessage()
  {
    return this.repository.getData(this.URL + "/getMessage")
  }
  //getDetailByID
  getDetailByID(ID: any) {
    return this.repository.getData(this.URL + "/getDetailByID?ID=" + ID)
  }
  
  //updateMessagae
  updateMessage(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.repository.update(this.URL + "/updateMessage", abc)
      .toPromise()
      .then(res => res as SmsAlert)
      .catch()
  }
  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.repository.update(this.URL, abc)
      .toPromise()
      .then(res => res as SmsAlert)
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
  //cancelAlertNotification
  cancelAlertNotification(ID: any) {
    return this.repository.getData(this.URL + "/cancelAlertNotification?ID=" + ID)
  }


}
