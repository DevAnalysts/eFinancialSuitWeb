
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { ItemSubCategory } from '../../../shared';

@Injectable()
export class ItemSubCategoryService {

  URL = 'api/ItemSubCategory';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getCategory
  getCategory() {
    return this.httpRepository.getData(this.URL + "/getCategory")
  }
  //getinvt
  getinvt() {
    return this.httpRepository.getData(this.URL + "/getinventory")
  }
  //getsale
  getsale() {
    return this.httpRepository.getData(this.URL + "/getsale")
  }
  //getcos
  getcos() {
    return this.httpRepository.getData(this.URL + "/getcogs")
  }

  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

  //saveData
  saveData(category: any): Promise<any> {
    let body = JSON.stringify(category);
  //  alert(body);
    return this.httpRepository.create(this.URL, category )
      .toPromise()
      .then(res => res.json() as ItemSubCategory)
      .catch()
  }

  ////updateData
  updateData(subcategory: any): Promise<any> {
    let body = JSON.stringify(subcategory);
    //  alert(body);
    return this.httpRepository.update(this.URL, subcategory )
      .toPromise()
      .then(res => res.json() as ItemSubCategory)
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
