
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { HSubCategory } from '../../../shared';


@Injectable()
export class HSubCategoryService {

  URL = 'api/HSubCategory';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getAssetCategory
  getHSubCategory() {
    return this.httpRepository.getData(this.URL + "/getHSubCategory")
  }

  ////getDetailsByID
  getDetailsByID(H_SubCategory: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?HSubCategoryCode=" + H_SubCategory)
  }

    //saveHSubCategory
  saveHSubCategory(H_subcat: any): Promise<any> {
    let body = JSON.stringify(H_subcat);
  //  alert(body);
    return this.httpRepository.create(this.URL, H_subcat )
      .toPromise()
      .then(res => res.json() as HSubCategory)
      .catch()
  }

  ////////updateSubject
  UpdatHSubCategory(H_subcat: any): Promise<any> {
    let body = JSON.stringify(H_subcat);
    //  alert(body);
    return this.httpRepository.update(this.URL, H_subcat )
      .toPromise()
      .then(res => res.json() as HSubCategory)
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
