import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { ImgUpload } from '../../../shared';
import { RepositoryService } from '@services/repository.service';

@Injectable()
export class EmployeeImageService {

  URL = 'api/EmployeeRegistration';
  constructor(private httpRepository: RepositoryService) { }

  postFile(caption: string, fileToUpload: File) {
    const endpoint = this.URL + '/upload';
    let formData = new FormData();
    formData.append("file", fileToUpload);
    return this.httpRepository.createImage(endpoint, formData);
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
