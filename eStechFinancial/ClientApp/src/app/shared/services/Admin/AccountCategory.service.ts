
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Accountcategory } from '../../../shared';


@Injectable()
export class AccountCategoryService {

  URL = 'api/AccountCategory';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getAccountType
  getAccountCategory() {
    return this.httpRepository.getData(this.URL + "/getAccountCategory")
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