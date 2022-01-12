import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
  
import { Observable } from 'rxjs/Observable';
import { EmployeeAcademicQualification } from '../../../../shared';

@Injectable()
export class AcademicQualificationService {

  URL = 'api/AcademicQualification';
  
  constructor(private httpRepository: RepositoryHttpService) { }

    //getGrid
    getGrid(value,priviledged_Offices) {
      return this.httpRepository.getData(this.URL + "/getGrid?filter="+value+" &priviledged_Offices="+priviledged_Offices)
    } 
    
    getEmployees(ID:any,priviledged_Offices:any) {
      return this.httpRepository.getData(this.URL + "/getEmployees?ID="+ID+"&priviledged_Offices="+priviledged_Offices)
    }
  
  //getDepartment
  getDepartment(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDepartment?EMP_ID=" + EMP_ID)
  }
  //getDesignation
  getDesignation(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDesignation?EMP_ID=" + EMP_ID)
  }
  //getQualification
  getQualification(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getQualification?EMP_ID=" + EMP_ID)
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
  //saveQualification
  saveQualification(empqualification: any): Promise<any> {
    let body = JSON.stringify(empqualification);
     return this.httpRepository.create(this.URL, empqualification )
      .toPromise()
      .then(res => res.json() as EmployeeAcademicQualification)
      .catch()
  }
  //updateQualification
  updateQualification(empqualification: Array<EmployeeAcademicQualification>): Promise<any> {
    let body = JSON.stringify(empqualification);
    return this.httpRepository.update(this.URL, empqualification )
      .toPromise()
      .then(res => res.json() as EmployeeAcademicQualification)
      .catch()
  }


  //deleteQualification
  deleteQualification(empqualification: any): Promise<any> {
    let body = JSON.stringify(empqualification);
     return this.httpRepository.update(this.URL+'/Delete', empqualification )
      .toPromise()
      .then(res => res.json() as EmployeeAcademicQualification)
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
