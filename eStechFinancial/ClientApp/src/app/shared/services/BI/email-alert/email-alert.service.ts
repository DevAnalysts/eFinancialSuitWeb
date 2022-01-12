
import { Injectable } from '@angular/core';
  
import { Observable } from 'rxjs/Observable';
import { EmailAlert } from '@shared/models/BI/EmailAlert';
import { RepositoryService } from '@services/repository.service';

@Injectable()
export class EmailAlertService {

  URL = 'api/EmailAlert';
  constructor(private repository: RepositoryService) { }


  //getGrid
  getGrid() {
    return this.repository.getData(this.URL + "/getGrid")
  }
  //getGrid
  getPdf(){
    
    return this.repository.getData(this.URL + "/viewPdf");
  }
  //getCategory
  getCategory() {
    return this.repository.getData(this.URL + "/getCategory")
  }
  //getTemplate
  getTemplate() {
    return this.repository.getData(this.URL + "/getTemplate")
  }
  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.repository.getData(this.URL + "/getDetailsByID?ID=" + ID)
  }
  //getAttachmentByID
  getAttachmentByID(ID: any) {
    return this.repository.getData(this.URL + "/getAttachmentByID?ID=" + ID)
  }
  //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.repository.create(this.URL + "/save", abc)
      .toPromise()
      .then(res => res as EmailAlert)
      .catch()
  }
  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.repository.update(this.URL, abc)
      .toPromise()
      .then(res => res as EmailAlert)
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
  //cancelAlertNotification
  cancelAlertNotification(ID: any) {
    return this.repository.getData(this.URL + "/cancelAlertNotification?ID=" + ID)
  }

  //sendEmail
  sendEmail() {
    return this.repository.getData(this.URL + "/sendEmail")
  }
  //sendReportMail
  sendReportMail(ParentID: any, ParentType: any, Email: any, Body: any) {
    return this.repository.getData(this.URL + "/sendReportMail?ParentID=" + ParentID + "&ParentType=" + ParentType + "&Email=" + Email + "&Body=" + Body + "")
  }

   //upload
  postFile(GUID: any, ParentType: any, FileName: any, fileToUpload: File) {
    const endpoint = this.URL + '/upload?ID=' + GUID + '&ParentType=' + ParentType + '&FileName=' + FileName + '';
    let formData = new FormData();
    formData.append("file", fileToUpload);
    return this.repository.create(endpoint, formData);
  }
  //getFileAttachments
  getFileAttachments(Guid: any) {
    return this.repository.getData(this.URL + "/getFileAttachments?Guid=" + Guid)
  }
  //SearchCustomerDropDownByCategoryForEmail
  SearchCustomerDropDownByCategoryForEmail(Query: any, Category: any) {
    return this.repository.getData(this.URL + "/SearchCustomerDropDownByCategoryForEmail?Query=" + Query + "&Category=" + Category)
  }

  //cancelFileAttachments
  cancelFileAttachments(ID: any) {
    return this.repository.getData(this.URL + "/cancelFileAttachments?ID=" + ID)
  }
  //getMailAttachmentByID
  getMailAttachmentByID(ID: any) {
    return this.repository.getData(this.URL + "/getMailAttachmentByID?ID=" + ID)
  }
  //viewFile
  viewFile() {
    return this.repository.getData(this.URL + "/viewFile");
  }
}
