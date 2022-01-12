
import { Injectable } from '@angular/core';
import { RepositoryService } from '@services/repository.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ItemImageService {

  URL = 'api/ItemRegistration';
   
  constructor(private Repository: RepositoryService) { }

 
  postFile(caption: string, fileToUpload: File) {
    const endpoint = this.URL + '/upload';
    let formData= new FormData(); 
   // formData.append('ImageCaption', caption);

    formData.append("file", fileToUpload);

 
    return this.Repository.create(endpoint, formData);
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
