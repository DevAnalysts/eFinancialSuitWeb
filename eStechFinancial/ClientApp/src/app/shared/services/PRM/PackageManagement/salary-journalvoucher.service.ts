import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { SalaryJV } from '../../../../shared';

@Injectable()
export class SalaryJournalVoucherService {

  URL = 'api/SalaryJournalVoucher';
   
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
  //getMonth
  getMonth(OFFICE_CODE: any, EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getMonth?OFFICE_CODE=" + OFFICE_CODE +"&EMP_ID=" + EMP_ID)
  }
  //viewJV
  viewJV(SalaryMonthID: any, OFFICE_CODE: any, VOUCHER_DATE: any, REMARKS: any, USER_ID: any) {
    return this.httpRepository.getData(this.URL + "/viewJV?SalaryMonthID=" + SalaryMonthID + "&OFFICE_CODE=" + OFFICE_CODE + "&VOUCHER_DATE=" + VOUCHER_DATE + "&REMARKS=" + REMARKS + "&USER_ID=" + USER_ID)
  }


  //getDetailsByID
  getDetailsByID(Voucher_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?Voucher_ID=" + Voucher_ID)
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
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
   return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as SalaryJV)
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
