
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { Area } from '../../../shared';


@Injectable()
export class AreaService {

  URL = 'api/Area';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getArea
  getArea() {
    return this.httpRepository.getData(this.URL + "/getArea")
  }
  //getCity
  getCity() {
    return this.httpRepository.getData(this.URL + "/getCity")
  }

  ////getDetailsByID
  getDetailsByID(id: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?AREA_CODE=" + id)
  }

    //saveArea
  saveArea(area: any): Promise<any> {
    let body = JSON.stringify(area);
  //  alert(body);
    return this.httpRepository.create(this.URL, area )
      .toPromise()
      .then(res => res.json() as Area)
      .catch()
  }

  //////updateArea
  UpdateArea(asset: any): Promise<any> {
    let body = JSON.stringify(asset);
      //alert(body);
    return this.httpRepository.update(this.URL, asset )
      .toPromise()
      .then(res => res.json() as Area)
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
