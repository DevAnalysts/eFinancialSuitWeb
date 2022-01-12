import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 import { Observable } from 'rxjs/Observable';
import { EmployeeTermination} from '../../../../shared';

@Injectable()
export class SalaryAccountService {

  URL = 'api/SalaryAccount';
  
  constructor(private httpRepository: RepositoryHttpService) { }

//getGrid
getGrid(value,priviledged_Offices:any) {
  return this.httpRepository.getData(this.URL + "/getGrid?filter="+value+"&priviledged_Offices="+priviledged_Offices)
} 

getEmployees(priviledged_Offices:any) {
  return this.httpRepository.getData(this.URL + "/getEmployees?priviledged_Offices="+priviledged_Offices)
}
  //getDepartment
  getDepartment(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDepartment?EMP_ID=" + EMP_ID)
  }
  //getDesignation
  getDesignation(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDesignation?EMP_ID=" + EMP_ID)
  }
  //getOffice
  getOffice(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getOffice?EMP_ID=" + EMP_ID)
  }
  //getBank
  getBank() {
    return this.httpRepository.getData(this.URL + "/getBank")
  }
  //getBankBranch
  getBankBranch(BANK_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getBankBranch?BANK_CODE=" + BANK_CODE)
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
      .then(res => res.json() as EmployeeTermination)
      .catch()
  }
  //updateData
  updateData(emppq: any): Promise<any> {
    let body = JSON.stringify(emppq);
    return this.httpRepository.update(this.URL, emppq )
      .toPromise()
      .then(res => res.json() as EmployeeTermination)
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
