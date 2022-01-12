
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { City } from '../../../shared';

@Injectable()
export class CityService {

  URL = 'api/City';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getDistrict
  getDistrict() {
    return this.httpRepository.getData(this.URL + "/getDistrict")
  }
  //getRegion
  getRegion() {
    return this.httpRepository.getData(this.URL + "/getRegion")
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }
  //saveData
  saveData(city: any): Promise<any> {
    let body = JSON.stringify(city);
    //alert(body);
    return this.httpRepository.create(this.URL, city )
      .toPromise()
      .then(res => res.json() as City)
      .catch()
  }

  //updateData
  updateData(user: any): Promise<any> {
    let body = JSON.stringify(user);
    //alert(body);
    return this.httpRepository.update(this.URL, user )
      .toPromise()
      .then(res => res.json() as City)
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
