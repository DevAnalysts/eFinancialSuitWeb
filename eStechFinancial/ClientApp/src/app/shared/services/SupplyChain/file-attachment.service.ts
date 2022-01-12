
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
 




@Injectable()
export class FileAttachmentService {

  URL = 'api/FileAttachment';
   
   constructor(private httpRepository: RepositoryHttpService) { }

 //upload
  postFile(GUID: any,ParentType: any, FileName: any,fileToUpload: File) {
    const endpoint = this.URL + '/upload?ID=' + GUID + '&ParentType=' + ParentType + '&FileName=' + FileName +'';
    let formData = new FormData();
    formData.append("file", fileToUpload);
    return this.httpRepository.create(endpoint, formData);
  }
  //getFileAttachments
  getFileAttachments(Guid: any) {
    return this.httpRepository.getData(this.URL + "/getFileAttachments?Guid=" + Guid)
  }
  //cancelFileAttachments
  cancelFileAttachments(ID: any) {
    return this.httpRepository.getData(this.URL + "/cancelFileAttachments?ID=" + ID)
  }
  //getAttachmentByID
  getAttachmentByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getAttachmentByID?ID=" + ID)
  }
  //viewFile
  viewFile() {
    return this.httpRepository.getData(this.URL + "/viewFile");
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
