
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeaderService {


  URL = 'api/Login';

  constructor(private httpRepository: RepositoryHttpService) { }
  //getHeaders
  getHeaders(logedInUserID: any) {
    return this.httpRepository.getData(this.URL + "/getHeaders?logedInUserID=" + logedInUserID + "")
  }
  //getSubHeaders
  getSubHeaders(logedInUserID: any) {
    return this.httpRepository.getData(this.URL + "/getSubHeaders?logedInUserID=" + logedInUserID + "")
  }
  //getUserPriviligedFiles
  getUserPriviligedFiles(logedInUserID: any) {
    return this.httpRepository.getData(this.URL + "/getUserPriviligedFiles?logedInUserID=" + logedInUserID + "")
  }
  getFunctionHotKeys(userid: any) {
    return this.httpRepository.getData(this.URL + "/getFunctionHotKeys?userID=" + userid);
  }
  //getPageDetail
  getPageDetail(page_ID: any) {
    return this.httpRepository.getData(this.URL + "/getPageDetail?page_ID=" + page_ID + "")
  }

  //setTask
  setTask(task: any, User_ID: any) {
    return this.httpRepository.getData(this.URL + "/setTask?task=" + task + "&User_ID=" + User_ID)
  }
  //setTaskCompleted
  setTaskCompleted(ID: any, status: any) {
    return this.httpRepository.getData(this.URL + "/setTaskStatus?ID=" + ID + "&status=" + status)
  }
  //deleteTask
  deleteTask(ID: any, status: any) {
    return this.httpRepository.getData(this.URL + "/setTaskStatus?ID=" + ID + "&status=" + status)
  }
  //getPendingTask
  getPendingTask(User_ID: any) {
    return this.httpRepository.getData(this.URL + "/getPendingTask?User_ID=" + User_ID)
  }
  //getCompletedTask
  getCompletedTask(User_ID: any) {
    return this.httpRepository.getData(this.URL + "/getCompletedTask?User_ID=" + User_ID)
  }

  //getTaskDetailsByID
  getTaskDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getTaskDetailsByID?ID=" + ID)
  }
  //updateTask
  updateTask(ID: any, task: any) {
    return this.httpRepository.getData(this.URL + "/updateTask?ID=" + ID + "&task=" + task)
  }

}
