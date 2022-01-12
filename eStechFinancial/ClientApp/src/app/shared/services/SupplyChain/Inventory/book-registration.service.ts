import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Books } from '../../../../shared';

@Injectable()
export class BookRegistrationService {

  URL = 'api/BookRegistration';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getBooks
  getBooks() {
    return this.httpRepository.getData(this.URL + "/getBooks")
  }
  //searchBookDetails
  searchBookDetails(item_Code: any) {
    return this.httpRepository.getData(this.URL + "/searchBookDetails?item_Code=" + item_Code + "")
  }
  //getCategories
  getCategories() {
    return this.httpRepository.getData(this.URL + "/getCategories")
  }
  //getSubCategories
  getSubCategories(category_Code:any) {
    return this.httpRepository.getData(this.URL + "/getSubCategories?category_Code=" + category_Code + "")
  }
  //getSubject
  getSubject() {
    return this.httpRepository.getData(this.URL + "/getSubject")
  }
  //getPublisher
  getPublisher() {
    return this.httpRepository.getData(this.URL + "/getPublisher")
  }
  //getCountry
  getCountry() {
    return this.httpRepository.getData(this.URL + "/getCountry")
  }
  //getTaxTypes
  getTaxTypes() {
    return this.httpRepository.getData(this.URL + "/getTaxTypes")
  }
  //getPriceList
  getPriceList(item_Code: any, mode: any) {
    return this.httpRepository.getData(this.URL + "/getPriceList?item_Code=" + item_Code + "&mode=" + mode + "")
  }
  //IfExists
  IfExists(item_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?item_ID=" + item_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //saveItem
  saveItem(item: any): Promise<any> {
    let body = JSON.stringify(item);
  //  alert(body);
   return this.httpRepository.create(this.URL, item )
      .toPromise()
      .then(res => res.json() as Books)
      .catch()
  }
  //updateItem
  updateItem(item: any): Promise<any> {
    let body = JSON.stringify(item);
    return this.httpRepository.update(this.URL, item )
      .toPromise()
      .then(res => res.json() as Books)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(item_Code: Number): Observable<Books> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?item_Code=" + item_Code + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getSubjectByID
  getSubjectByID(item_Code: any) {
    return this.httpRepository.getData(this.URL + "/getSubjectByID?item_Code=" + item_Code + "")
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
