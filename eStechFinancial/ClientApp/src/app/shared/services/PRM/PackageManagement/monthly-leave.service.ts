import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { MonthlyLeave} from '../../../../shared';

@Injectable()
export class MonthlyLeaveService {

  URL = 'api/MonthlyLeave';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(value,priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getGrid?filter="+value+"&priviledged_Offices="+priviledged_Offices)
  }
  //getEmployees
  getEmployees(OFFICE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getEmployees?OFFICE_CODE=" + OFFICE_CODE)
  }
 
  //getOffice
  getOffice(priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getOffice?priviledged_Offices="+priviledged_Offices)
  }
  //getMonth
  getMonth(OFFICE_CODE: any, EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getMonth?OFFICE_CODE=" + OFFICE_CODE +"&EMP_ID=" + EMP_ID)
  }
  //calculateLeave
  calculateLeave(OFFICE_CODE: any, EMP_ID: any, FromDate: any, ToDate: any, SalaryMonthID: any) {
    return this.httpRepository.getData(this.URL + "/calculateLeave?OFFICE_CODE=" + OFFICE_CODE + "&EMP_ID=" + EMP_ID + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&SalaryMonthID=" + SalaryMonthID)
  }

 
  

  //getDetailsByID
  getDetailsByID(MonthlyLeaveID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?MonthlyLeaveID=" + MonthlyLeaveID)
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
  ////saveData
  //saveData(abc: Array<MonthlyLeave>): Promise<any> {
  //  let body = JSON.stringify(abc);
  // return this.httpRepository.create(this.URL, abc )
  //    .toPromise()
  //    .then(res => res.json() as MonthlyLeave)
  //    .catch()
  //}

  //saveData
  saveData(abc: Array<MonthlyLeave>): Promise<any> {
    let body = JSON.stringify(abc);
   return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as MonthlyLeave)
      .catch()
  }


  //updateData
  updateData(abc: Array<MonthlyLeave>): Promise<any> {
    let body = JSON.stringify(abc);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as MonthlyLeave)
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
