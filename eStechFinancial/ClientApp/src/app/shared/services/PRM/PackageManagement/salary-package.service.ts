import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
import { SalaryPackage } from '../../../../shared';

@Injectable()
export class SalaryPackageService {

  URL = 'api/SalaryPackage';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(value,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?filter="+value+"&priviledged_Offices="+priviledged_Offices)
  }
  //getMonth
  getMonth(OFFICE_CODE: any, EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getMonth?OFFICE_CODE=" + OFFICE_CODE + "&EMP_ID=" + EMP_ID)
  }
  //getEmployees
  getEmployees(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getEmployees?priviledged_Offices="+priviledged_Offices)
  }
  //getCurrentEffect
  getCurrentEffect(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getCurrentEffect?EMP_ID=" + EMP_ID)
  }
  //getAllowanceAll
  getAllowanceAll() {
    return this.httpRepository.getData(this.URL + "/getAllowanceAll")
  }
  //getAllowance
  getAllowance(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getAllowance?EMP_ID=" + EMP_ID)
  }
  //getContribution
  getContribution(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getContribution?EMP_ID=" + EMP_ID)
  }
  //getDeduction
  getDeduction(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDeduction?EMP_ID=" + EMP_ID)
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
  //getEmpType
  getEmpType(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getEmpType?EMP_ID=" + EMP_ID)
  }
  //getFamily
  getFamily(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getFamily?EMP_ID=" + EMP_ID)
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
  saveData(pkg: any): Promise<any> {
    let body = JSON.stringify(pkg);
   return this.httpRepository.create(this.URL, pkg )
      .toPromise()
      .then(res => res.json() as SalaryPackage)
      .catch()
  }
  //updateData
  updateData(pkg: any): Promise<any> {
    let body = JSON.stringify(pkg);
    return this.httpRepository.update(this.URL, pkg )
      .toPromise()
      .then(res => res.json() as SalaryPackage)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(Package_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?Package_ID=" + Package_ID)
  }
  //getSubDetailsByID
  getSubDetailsByID(Package_ID: any) {
    return this.httpRepository.getData(this.URL + "/getSubDetailsByID?Package_ID=" + Package_ID)
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
