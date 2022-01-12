import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MonthlySalaryStopService {

  URL = 'api/MonthlySalaryStop';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(value,priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getGrid?filter="+value+"&priviledged_Offices="+priviledged_Offices)
  }
  //getDetailsByID
  getDetailsByID(ID: any, TYPE: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID + "&TYPE=" + TYPE)
  }
  //getSalaryAllowanceByID
  getSalaryAllowanceByID(ID: any, TableType: any,TYPE: any) {
    return this.httpRepository.getData(this.URL + "/getSalaryAllowanceByID?ID=" + ID + "&TableType=" + TableType + "&TYPE=" + TYPE)
  }
  //searchEmpDetails
  searchEmpDetails(emP_CODE: any) {
    return this.httpRepository.getData(this.URL + "/searchEmpDetails?emP_CODE=" + emP_CODE + "")
  }
  //IfExists
  IfExists(salaryHistoryID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?salaryHistoryID=" + salaryHistoryID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //checkVoucherExist
  checkVoucherExist(SalaryHistoryID: any) {
    return this.httpRepository.getData(this.URL + "/checkVoucherExist?SalaryHistoryID=" + SalaryHistoryID)
  }
  //cancelSalary
  cancelSalary(ID: any, TableType: any) {
    return this.httpRepository.getData(this.URL + "/cancelSalary?ID=" + ID + "&TableType=" + TableType)
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
