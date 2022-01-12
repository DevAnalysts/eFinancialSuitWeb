
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AssetCategory } from '../../../shared';


@Injectable()
export class AssetCategoryService {

  URL = 'api/AssetCategory';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }

  //getAccounts
  getAccounts() {
    return this.httpRepository.getData(this.URL + "/getAccounts")
  }

  ////getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }

    //saveData
  saveData(asset: any): Promise<any> {
    let body = JSON.stringify(asset);
  //  alert(body);
    return this.httpRepository.create(this.URL, asset )
      .toPromise()
      .then(res => res.json() as AssetCategory)
      .catch()
  }

  //updateData
  updateData(asset: any): Promise<any> {
    let body = JSON.stringify(asset);
    //  alert(body);
    return this.httpRepository.update(this.URL, asset )
      .toPromise()
      .then(res => res.json() as AssetCategory)
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
