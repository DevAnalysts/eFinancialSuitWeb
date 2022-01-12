import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { SalaryPV } from '../../../../shared';

@Injectable()
export class SalaryPaymentVoucherService {

  URL = 'api/SalaryPaymentVoucher';
   
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
  getMonth(OFFICE_CODE: any, EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getMonth?OFFICE_CODE=" + OFFICE_CODE +"&EMP_ID=" + EMP_ID)
  }
  //getCashAccounts
  getCashAccounts() {
    return this.httpRepository.getData(this.URL + "/getCashAccounts")
  }
  //viewPV
  viewPV(SalaryMonthID: any, OFFICE_CODE: any, VOUCHER_DATE: any, REMARKS: any, USER_ID: any, Type: any, Code: any) {
    return this.httpRepository.getData(this.URL + "/viewPV?SalaryMonthID=" + SalaryMonthID + "&OFFICE_CODE=" + OFFICE_CODE + "&VOUCHER_DATE=" + VOUCHER_DATE + "&REMARKS=" + REMARKS + "&USER_ID=" + USER_ID + "&Type=" + Type + "&Code=" + Code)
  }
  //getDetailsByID
  getDetailsByID(Voucher_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?Voucher_ID=" + Voucher_ID)
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
      .then(res => res.json() as SalaryPV)
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
