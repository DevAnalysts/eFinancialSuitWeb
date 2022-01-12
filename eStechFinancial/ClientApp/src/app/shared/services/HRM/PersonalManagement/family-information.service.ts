import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
  
import { Observable } from 'rxjs/Observable';
import { EmployeeFamily } from '../../../../shared';

@Injectable()
export class FamilyInformationService {

  URL = 'api/FamilyInformation';
  
  constructor(private httpRepository: RepositoryHttpService) { }

 //getGrid
 getGrid(value,priviledged_Offices) {
  return this.httpRepository.getData(this.URL + "/getGrid?filter="+value+"&priviledged_Offices="+priviledged_Offices)
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
  //saveFamily
  saveFamily(empfamily: any): Promise<any> {
    let body = JSON.stringify(empfamily);
     return this.httpRepository.create(this.URL, empfamily )
      .toPromise()
      .then(res => res.json() as EmployeeFamily)
      .catch()
  }
  updateFamily(empfamily: Array<EmployeeFamily>): Promise<any> {
    let body = JSON.stringify(empfamily);
    return this.httpRepository.update(this.URL, empfamily )
      .toPromise()
      .then(res => res.json() as EmployeeFamily)
      .catch()
  }
  //deleteQualification
  deleteQualification(empfamily: any): Promise<any> {
    let body = JSON.stringify(empfamily);
     return this.httpRepository.update(this.URL+'/Delete', empfamily )
      .toPromise()
      .then(res => res.json() as EmployeeFamily)
      .catch()
  }
  ////getDetailsByID
  //getDetailsByID(EMP_ID: Number): Observable<Employee> {
  //  return this.httpRepository.getData(this.URL + "/getDetailsByID?EMP_ID=" + EMP_ID + "")
  //    .map((res) => {
  //      return res.json()[0];
  //    })
  //    .catch(this.handleError);
  //}
  //getAddressPresentByID
  getAddressPresentByID(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getAddressPresentByID?EMP_ID=" + EMP_ID)
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
