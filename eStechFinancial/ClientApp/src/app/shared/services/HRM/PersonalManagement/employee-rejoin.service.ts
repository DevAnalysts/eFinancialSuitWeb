import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
  
import { Observable } from 'rxjs/Observable';
import { EmployeeRejoin } from '../../../../shared';

@Injectable()
export class EmployeeRejoinService {

  URL = 'api/EmployeeRejoin';
  
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
  //getPrevOffice
  getPrevOffice(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getPrevOffice?EMP_ID=" + EMP_ID)
  }
  //getCategory
  getCategory(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getCategory?EMP_ID=" + EMP_ID)
  }
  //getOfficeNew
  getOfficeNew() {
    return this.httpRepository.getData(this.URL + "/getOfficeNew")
  }
  //getDesignationNew
  getDesignationNew() {
    return this.httpRepository.getData(this.URL + "/getDesignationNew")
  }
  //getDepartmentNew
  getDepartmentNew() {
    return this.httpRepository.getData(this.URL + "/getDepartmentNew")
  }
  //getCategoryNew
  getCategoryNew() {
    return this.httpRepository.getData(this.URL + "/getCategoryNew")
  }
  //getDesignation
  getDetailsByID(Rejoin_Code: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?Rejoin_Code=" + Rejoin_Code)
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
  //saveContractRenewal
  saveEmployeeRejoin(emppq: any): Promise<any> {
    let body = JSON.stringify(emppq);
     return this.httpRepository.create(this.URL, emppq )
      .toPromise()
      .then(res => res.json() as EmployeeRejoin)
      .catch()
  }
  //updateContractRenewal
  updateEmployeeRejoin(emppq: any): Promise<any> {
    let body = JSON.stringify(emppq);
    return this.httpRepository.update(this.URL, emppq )
      .toPromise()
      .then(res => res.json() as EmployeeRejoin)
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
