import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { IncomeTaxYear } from '../../../../shared';

@Injectable()
export class IncomeTaxRateService {

  URL = 'api/IncomeTaxRate';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(value) {
    return this.httpRepository.getData(this.URL + "/getGrid?filter="+value+"")
  }

  //getFiscalYear
  getFiscalYear() {
    return this.httpRepository.getData(this.URL + "/getFiscalYear")
  }

  //getAmountFrom
  getAmountFrom() {
    return this.httpRepository.getData(this.URL + "/getAmountFrom")
  }

  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }
  //searchEmpDetails
  searchEmpDetails(emP_CODE: any) {
    return this.httpRepository.getData(this.URL + "/searchEmpDetails?emP_CODE=" + emP_CODE + "")
  }
  //IfExists
  IfExists(emP_CODE: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?emP_CODE=" + emP_CODE + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    
   return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as IncomeTaxYear)
      .catch()
  }
  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as IncomeTaxYear)
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
