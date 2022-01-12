
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { MasterList } from '../../../shared';


@Injectable()
export class MasterListService {

  URL = 'api/MasterList';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getDesignation
  getMasterList() {
    return this.httpRepository.getData(this.URL + "/getMasterList")
  }

  ////getDetailsByID
  getDetailsByID(L_MasterID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?MasterID=" + L_MasterID)
  }

  ////saveMaster
  saveMaster(Mast: any): Promise<any> {
    let body = JSON.stringify(Mast);
    //  alert(body);
    return this.httpRepository.create(this.URL, Mast )
      .toPromise()
      .then(res => res.json() as MasterList)
      .catch()
  }

  ////////////UpdateMaster
  UpdateMaster(Mast: any): Promise<any> {
    let body = JSON.stringify(Mast);
    //  alert(body);
    return this.httpRepository.update(this.URL, Mast )
      .toPromise()
      .then(res => res.json() as MasterList)
      .catch()
  }


  ////getSession
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
