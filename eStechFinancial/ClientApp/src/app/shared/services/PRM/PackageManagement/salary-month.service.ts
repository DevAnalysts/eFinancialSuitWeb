import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { SalaryMonth} from '../../../../shared';

@Injectable()
export class SalaryMonthService {

  URL = 'api/SalaryMonth';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(value,priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getGrid?filter="+value+"&priviledged_Offices="+priviledged_Offices)
  }
 
  //getOffice
  getOffice(priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getOffice?priviledged_Offices="+priviledged_Offices)
  }
  //getMonth
  getMonth(OFFICE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getMonth?OFFICE_CODE=" + OFFICE_CODE)
  }
  

  //getDetailsByID
  getDetailsByID(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?EMP_ID=" + EMP_ID)
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
  saveData(emppq: any): Promise<any> {
    let body = JSON.stringify(emppq);
   return this.httpRepository.create(this.URL, emppq )
      .toPromise()
      .then(res => res.json() as SalaryMonth)
      .catch()
  }
  //updateData
  updateData(emppq: any): Promise<any> {
    let body = JSON.stringify(emppq);
    return this.httpRepository.update(this.URL, emppq )
      .toPromise()
      .then(res => res.json() as SalaryMonth)
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
