
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { ExpenseType } from '../../../shared';


@Injectable()
export class ExpenseTypeService {

  URL = 'api/ExpenseType';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getExpenseType
  getExpense() {
    return this.httpRepository.getData(this.URL + "/getExpenseType")
  }

  ////getDetailsByID
  getDetailsByID(expense: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + expense)
  }

  //saveSubject
  saveAssetSubCategory(expense: any): Promise<any> {
    let body = JSON.stringify(expense);
    //  alert(body);
    return this.httpRepository.create(this.URL, expense )
      .toPromise()
      .then(res => res.json() as ExpenseType)
      .catch()
  }

  //////updateSubject
  UpdateAssetSubCategory(expense: any): Promise<any> {
    let body = JSON.stringify(expense);
    //  alert(body);
    return this.httpRepository.update(this.URL, expense )
      .toPromise()
      .then(res => res.json() as ExpenseType)
      .catch()
  }

  //getsession 
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
