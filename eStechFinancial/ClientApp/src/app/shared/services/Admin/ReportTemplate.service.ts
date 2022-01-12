
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable'; 

@Injectable()
export class ReportTemplateService {


  
  URL = 'api/ReportTemplate';
   
  constructor(private httpRepository: RepositoryHttpService) { }


  getOffice(userPrivilegedOffice: any) {
    
    return this.httpRepository.getData(this.URL + '/office?userPrivilegedOffice=' + userPrivilegedOffice + '');
     
  }  

  //getReportTemplates s
  getReportTemplates() {
 
    return this.httpRepository.getData(this.URL + "/getReportTemplates") 
  
    
  } 

  ////getDetailsByID
  getDetailsByID(id: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + id)
  }

    //saveReportTemplate
  saveReportTemplate(tempalte: any): Promise<any> {
    let body = JSON.stringify(tempalte);
  //  alert(body);
    return this.httpRepository.create(this.URL, tempalte )
      .toPromise()
      .then(res => res.json() as any)
      .catch()
  }

  //////UpdateReportTemplate
  UpdateReportTemplate(tempalte: any): Promise<any> {
    let body = JSON.stringify(tempalte);
      //alert(body);
    return this.httpRepository.update(this.URL, tempalte )
      .toPromise()
      .then(res => res.json() as any)
      .catch()
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
