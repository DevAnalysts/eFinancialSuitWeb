import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { SalaryReview } from '../../../../shared';

@Injectable()
export class SalaryIncrementService {

  URL = 'api/SalaryIncrement';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getGrid?priviledged_Offices="+priviledged_Offices)
  }
  //getEmployees
  getEmployees(OFFICE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getEmployees?OFFICE_CODE=" + OFFICE_CODE)
  }
 
  //getOffice
  getOffice(priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getOffice?priviledged_Offices="+priviledged_Offices)
  }
  //getCategory
  getCategory() {
    return this.httpRepository.getData(this.URL + "/getCategory")
  }
  //getMonth
  getMonth(OFFICE_CODE: any, EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getMonth?OFFICE_CODE=" + OFFICE_CODE +"&EMP_ID=" + EMP_ID)
  }
  //getGrossIncrement
  getGrossIncrement(CategoryID: any, IncrementRate: any) {
    return this.httpRepository.getData(this.URL + "/getGrossIncrement?CategoryID=" + CategoryID + "&IncrementRate=" + IncrementRate)
  }


  //getDetailsByID
  getDetailsByID(SalaryHistoryID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?SalaryHistoryID=" + SalaryHistoryID)
  }
  //getSalaryAllowanceByID
  getSalaryAllowanceByID(SalaryHistoryID: any, TYPE: any) {
    return this.httpRepository.getData(this.URL + "/getSalaryAllowanceByID?SalaryHistoryID=" + SalaryHistoryID + "&TYPE=" + TYPE)
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
  saveData(abc: Array<SalaryReview>): Promise<any> {
    let body = JSON.stringify(abc);
   return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as SalaryReview)
      .catch()
  }

  //checkVoucherExist
  checkVoucherExist(SalaryHistoryID: any) {
    return this.httpRepository.getData(this.URL + "/checkVoucherExist?SalaryHistoryID=" + SalaryHistoryID)
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
