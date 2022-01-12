
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { ItemCategory } from '../../../shared';


@Injectable()
export class ItemCategoryService {

  URL = 'api/ItemCategory';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }

  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID);
  }

  getCategoryTypes()
  {
    return this.httpRepository.getData(this.URL + "/getCategoryTypes");
  }
    //saveData
  saveData(Type: any): Promise<any> {
    let body = JSON.stringify(Type);
  //  alert(body);
    return this.httpRepository.create(this.URL, Type )
      .toPromise()
      .then(res => res.json() as ItemCategory)
      .catch()
  }

  //updateData
  updateData(Type: any): Promise<any> {
    let body = JSON.stringify(Type);
    //  alert(body);
    return this.httpRepository.update(this.URL, Type )
      .toPromise()
      .then(res => res.json() as ItemCategory)
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
