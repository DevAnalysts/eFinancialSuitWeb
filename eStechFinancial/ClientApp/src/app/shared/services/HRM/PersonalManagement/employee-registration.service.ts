import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
  
import { Observable } from 'rxjs/Observable';
import { Employee } from '../../../../shared';

@Injectable()
export class EmployeeRegistrationService {

  URL = 'api/EmployeeRegistration';
  
  constructor(private httpRepository: RepositoryHttpService) { }
  
  //getEmployees
  /*getEmployees() {
    return this.httpRepository.getData(this.URL + "/getEmployees")
  }*/

  //getPriviledgedEmployees
  getEmployees(value,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getEmployees?filter="+value+"&priviledged_Offices="+priviledged_Offices)
  }
  
  //getNationality
  getNationality() {
    return this.httpRepository.getData(this.URL + "/getNationality")
  }
  //getOffice
  getOffice() {
    return this.httpRepository.getData(this.URL + "/getOffice")
  }
  //getDepartment
  getDepartment() {
    return this.httpRepository.getData(this.URL + "/getDepartment")
  }
  //getDesignation
  getDesignation(DEPARTMENT_CODE: any ) {
    return this.httpRepository.getData(this.URL + "/getDesignation?DEPARTMENT_CODE=" + DEPARTMENT_CODE)
  }
  //getEmploymentType
  getEmploymentType() {
    return this.httpRepository.getData(this.URL + "/getEmploymentType")
  }
  //getCategory
  getCategory() {
    return this.httpRepository.getData(this.URL + "/getCategory")
  }
  //getGrade
  getGrade() {
    return this.httpRepository.getData(this.URL + "/getGrade")
  }
  //getStatus
  getStatus() {
    return this.httpRepository.getData(this.URL + "/getStatus")
  }
  //getCity
  getCity() {
    return this.httpRepository.getData(this.URL + "/getCity")
  }
  //getDistrict
  getRegion(CITY_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getRegion?CITY_CODE=" + CITY_CODE)
  }
  //getProvince
  getProvince(PROVINCE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getProvince?PROVINCE_CODE=" + PROVINCE_CODE)
  }
  //getCountry
  getCountry(Country_id: any) {
    return this.httpRepository.getData(this.URL + "/getCountry?Country_id=" + Country_id)
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
  //saveEmployee
  saveEmployee(emps: any): Promise<any> {
    let body = JSON.stringify(emps);
  //  alert(body);
     return this.httpRepository.create(this.URL + "/save", emps )
      .toPromise()
      .then(res => res.json() as Employee)
      .catch()
  }
  //updateEmployee
  updateEmployee(emps: any): Promise<any> {
    let body = JSON.stringify(emps);
    //  alert(body);
    return this.httpRepository.update(this.URL, emps )
      .toPromise()
      .then(res => res.json() as Employee)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(EMP_ID: Number): Observable<Employee> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?EMP_ID=" + EMP_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getAddressPresentByID
  getAddressPresentByID(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getAddressPresentByID?EMP_ID=" + EMP_ID)
  }
  //getAddressPermanentByID
  getAddressPermanentByID(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getAddressPermanentByID?EMP_ID=" + EMP_ID)
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
