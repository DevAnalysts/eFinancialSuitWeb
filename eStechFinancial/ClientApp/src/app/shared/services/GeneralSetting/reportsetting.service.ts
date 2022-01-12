
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { PageColumn } from '../../../shared';

@Injectable()
export class ReportSettingService {

  URL = 'api/ReportSetting';
  
  constructor(private httpRepository: RepositoryHttpService) { }
  //getReportSetting
  getModule() {
    return this.httpRepository.getData(this.URL + "/getModule")
  }
   getPage(modulecode: any) {
     return this.httpRepository.getData(this.URL + "/getPage?TREE_NODE_CODE=" + modulecode)
  }
    //getReportSetting
  getReportSetting(pagecode: any) {
    return this.httpRepository.getData(this.URL + "/getReportSetting?PAGE_CODE=" + pagecode)
  }

    //saveUser
  savePageColumn(pagecolumn: any): Promise<any> {
    let body = JSON.stringify(pagecolumn);
  //  alert(body);
     return this.httpRepository.create(this.URL, pagecolumn )
      .toPromise()
      .then(res => res.json() as PageColumn)
      .catch()
  }
    //updateUser
  updatePageColumn(pagecolumn: Array<PageColumn>): Promise<any> {
    let body = JSON.stringify(pagecolumn);
    //alert(body);
    return this.httpRepository.update(this.URL, pagecolumn )
      .toPromise()
      .then(res => res.json() as PageColumn)
      .catch()
  }
  checkTitle(title: any) {
    return this.httpRepository.getData(this.URL + "/checkTitle?title=" + title)
  }
  checkKey(key: any) {
    return this.httpRepository.getData(this.URL + "/checkKey?key=" + key)
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
