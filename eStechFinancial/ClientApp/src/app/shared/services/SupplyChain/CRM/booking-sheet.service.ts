import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { BookingSheet } from '../../../../shared';

@Injectable()
export class BookingSheetService {

  URL = 'api/BookingSheet';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }

  //getArea
  getArea() {
    return this.httpRepository.getData(this.URL + "/getArea")
  }

  //getPriviledgedOffices
  getPriviledgedOffices(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }

  //getCustomers
  getCustomers(ID: any) {
    return this.httpRepository.getData(this.URL + "/getCustomers?ID=" + ID)
  }
  //getItems
  getItems(userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/getItems?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }
  //getBookingDetailsByID
  getBookingDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getBookingDetailsByID?ID=" + ID)
  }
  //searchEmpDetails
  searchEmpDetails(emP_CODE: any) {
    return this.httpRepository.getData(this.URL + "/searchEmpDetails?emP_CODE=" + emP_CODE + "")
  }
  //IfExists
  IfExists(emP_CODE: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?emP_CODE=" + emP_CODE + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
   return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as BookingSheet)
      .catch()
  }
  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as BookingSheet)
      .catch()
  }
  //cancelBookingSheet
  cancelBookingSheet(ID: any) {
    return this.httpRepository.getData(this.URL + "/cancelBookingSheet?ID=" + ID)
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
