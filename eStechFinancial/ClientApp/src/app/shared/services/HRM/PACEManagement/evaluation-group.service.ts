import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { EvaluationGroup } from '../../../../shared';


@Injectable()
export class EvaluationGroupService {


  URL = 'api/EvaluationGroup';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getGridSearch
  getGridSearch(query: any) {
    return this.httpRepository.getData(this.URL + "/getGridSearch?query=" + query+ "")
  }
  //getDesignation
  getDesignation() {
    return this.httpRepository.getData(this.URL + "/getDesignation")
  }
  //getSupervisor
  getSupervisor() {
    return this.httpRepository.getData(this.URL + "/getSupervisor")
  }
  //getKPI
  getKPI() {
    return this.httpRepository.getData(this.URL + "/getKPI")
  }

  //getDetailsByID
  getDetailsByID(ID: any): Observable<EvaluationGroup> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  //IfExists
  IfExists(sale_Return_ID: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?sale_Return_ID=" + sale_Return_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.URL + "/guidExist?guid=" + guid + "")
  }
  //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
     return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as EvaluationGroup)
      .catch()
  }
  //updateOrder
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as EvaluationGroup)
      .catch()
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

