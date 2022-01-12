import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Attendance } from '@shared/models/PRM/PackageManagement/Attendance';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AttendanceService {

  URL = 'api/Attendance';
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getGrid?priviledged_Offices=" + priviledged_Offices)
  }
  //getEmployeeAttendance
  getEmployeeAttendance(date: any, attendanceId: any, mode: any) {
    return this.httpRepository.getData(this.URL + "/getEmployeeAttendance?date=" + date + "&attendanceId=" + attendanceId + "&mode=" + mode + "")
  }
  //getOvertimeDetail
  getOvertimeDetail(EMP_ID: any, finalDate: any) {
    return this.httpRepository.getData(this.URL + "/getOvertimeDetail?EMP_ID=" + EMP_ID + "&finalDate=" + finalDate)
  }
  //getEmployees
  getEmployees(priviledged_Offices: any) {
    return this.httpRepository.getData(this.URL + "/getEmployees?priviledged_Offices=" + priviledged_Offices)
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
  saveData(attendance: any): Promise<any> {
    let body = JSON.stringify(attendance);
    return this.httpRepository.create(this.URL, attendance)
      .toPromise()
      .then(res => res.json() as Attendance)
      .catch()
  }
  //updateData
  updateData(attendance: any): Promise<any> {
    let body = JSON.stringify(attendance);
    return this.httpRepository.update(this.URL, attendance)
      .toPromise()
      .then(res => res.json() as Attendance)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(attendanceId: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?attendanceId=" + attendanceId)
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
