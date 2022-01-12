import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';

import { Observable } from 'rxjs/Observable';
import { overtime } from '../../../models/PRM/PackageManagement/Overtime';

@Injectable()
export class OvertimeService {

  URL = 'api/Overtime';

  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getGrid?priviledged_Offices=" + priviledged_Offices)
  }
  //getEmployeeAttendance
  getEmployeeAttendance(date: any, empID: any) {
    return this.httpRepository.getData(this.URL + "/getEmployeeAttendance?date=" + date + "&empID=" + empID + "")
  }
  //getAttendanceSheetMonthWise
  getAttendanceSheetMonthWise(date: any) {
    return this.httpRepository.getData(this.URL + "/getAttendanceSheetMonthWise?date=" + date + "")
  }
  //getAttendanceSheet
  getAttendanceSheet(date: any) {
    return this.httpRepository.getData(this.URL + "/getAttendanceSheet?date=" + date + "")
  }
  //getUniqueEmployee
  getUniqueEmployee(date: any) {
    return this.httpRepository.getData(this.URL + "/getUniqueEmployee?date=" + date + "")
  }
  //getMonth
  getMonth(OFFICE_CODE: any, EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getMonth?OFFICE_CODE=" + OFFICE_CODE + "&EMP_ID=" + EMP_ID)
  }
  //getOvertimeDetail
  getOvertimeDetail(EMP_ID: any, finalDate: any) {
    return this.httpRepository.getData(this.URL + "/getOvertimeDetail?EMP_ID=" + EMP_ID + "&finalDate=" + finalDate)
  }
  //getEmployees
  getEmployees(priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getEmployees?priviledged_Offices=" + priviledged_Offices)
  }
  //getCurrentEffect
  getCurrentEffect(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getCurrentEffect?EMP_ID=" + EMP_ID)
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
  //saveAttendance
  saveAttendance(overtime: any, userCurrentOffice: any, UserSessionID: any, guid: any): Promise<any> {
    let body = JSON.stringify(overtime);
    return this.httpRepository.create(this.URL + '' + '/saveAttendanceSheet?userCurrentOffice=' + userCurrentOffice + '&UserSessionID=' + UserSessionID + '&guid=' + guid + '', overtime)
      .toPromise()
      .then(res => res.json() as overtime)
      .catch()
  }
  //updateAttendance
  updateAttendance(overtime: any, overtimeId: number, userCurrentOffice: any, UserSessionID: any, guid: any): Promise<any> {
    alert(overtimeId);
    console.log(overtimeId);
    let body = JSON.stringify(overtime);
    return this.httpRepository.update(this.URL + '' + '/upadteAttendanceSheet?overtimeId=' + overtimeId + '&userCurrentOffice=' + userCurrentOffice + '&UserSessionID=' + UserSessionID + '&guid=' + guid + '', overtime)
      .toPromise()
      .then(res => res.json() as overtime)
      .catch()
  }
  //saveData
  saveData(overtime: any): Promise<any> {
    let body = JSON.stringify(overtime);
    return this.httpRepository.create(this.URL, overtime)
      .toPromise()
      .then(res => res.json() as overtime)
      .catch()
  }
  //updateData
  updateData(pkg: any): Promise<any> {
    let body = JSON.stringify(pkg);
    return this.httpRepository.update(this.URL, pkg)
      .toPromise()
      .then(res => res.json() as overtime)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(overtimeId: any, mode: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?overtimeId=" + overtimeId + "&mode=" + mode + "")
  }
  //getOvertimeDetailsByID
  getOvertimeDetailsByID(overtimeId: any, mode: any): Observable<overtime> {
    return this.httpRepository.getData(this.URL + "/getOvertimeDetailsByID?overtimeId=" + overtimeId + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //getSubDetailsByID
  getSubDetailsByID(Package_ID: any) {
    return this.httpRepository.getData(this.URL + "/getSubDetailsByID?Package_ID=" + Package_ID)
  }
  //getSession
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
