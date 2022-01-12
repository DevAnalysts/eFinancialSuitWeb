
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { TrainingType } from '../../../shared';


@Injectable()
export class TrainingTypeService {

  URL = 'api/TrainingType';
   
  constructor(private httpRepository: RepositoryHttpService) { }

  //getDesignation
  getTrainingType() {
   // alert('1');
    return this.httpRepository.getData(this.URL + "/getTrainingType")
  }

  //////getDetailsByID
  getDetailsByID(TrainingI_D: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?TrainingID=" + TrainingI_D)
  }

  //saveDesignation
  savetrain(Train: any): Promise<any> {
    let body = JSON.stringify(Train);
    //  alert(body);
    return this.httpRepository.create(this.URL, Train )
      .toPromise()
      .then(res => res.json() as TrainingType)
      .catch()
  }

  ////////////UpdateDesignation
  Updatetrain(train: any): Promise<any> {
    let body = JSON.stringify(train);
    //  alert(body);
    return this.httpRepository.update(this.URL, train)
      .toPromise()
      .then(res => res.json() as TrainingType)
      .catch()
  }


  ////getSession
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
