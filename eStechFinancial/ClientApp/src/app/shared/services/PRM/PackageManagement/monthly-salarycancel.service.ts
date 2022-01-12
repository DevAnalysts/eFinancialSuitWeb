import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { MonthlySalary } from '../../../../shared';

@Injectable()
export class MonthlySalaryCancelService {

  URL = 'api/MonthlySalaryCancel';
   
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
  //calculateSalary
  calculateSalary(OFFICE_CODE: any, EMP_ID: any, SalaryMonthID: any, mFirstDate: any, mLastDate: any, Salary_Date: any, USER_ID: any) {
    return this.httpRepository.getData(this.URL + "/calculateSalary?OFFICE_CODE=" + OFFICE_CODE + "&EMP_ID=" + EMP_ID + "&SalaryMonthID=" + SalaryMonthID + "&mFirstDate=" + mFirstDate + "&mLastDate=" + mLastDate + "&Salary_Date=" + Salary_Date + "&USER_ID=" + USER_ID)
  }

 
  

  //getDetailsByID
  getDetailsByID(SalaryID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?SalaryID=" + SalaryID)
  }
  //getSalaryAllowanceByID
  getSalaryAllowanceByID(SalaryID: any, TYPE: any) {
    return this.httpRepository.getData(this.URL + "/getSalaryAllowanceByID?SalaryID=" + SalaryID + "&TYPE=" + TYPE)
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
  saveData(abc: Array<MonthlySalary>): Promise<any> {
    let body = JSON.stringify(abc);
   return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as MonthlySalary)
      .catch()
  }

  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as MonthlySalary)
      .catch()
  }

  //cancelSalary
  cancelSalary(SalaryID: any) {
    return this.httpRepository.getData(this.URL + "/cancelSalary?SalaryID=" + SalaryID)
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
