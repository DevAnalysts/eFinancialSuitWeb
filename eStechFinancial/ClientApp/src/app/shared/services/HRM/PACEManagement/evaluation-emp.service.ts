import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { EvaluationEmp } from '../../../../shared';


@Injectable()
export class EvaluationEmpService {


  URL = 'api/EvaluationEmp';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getGridSearch
  getGridSearch(query: any) {
    return this.httpRepository.getData(this.URL + "/getGridSearch?query=" + query + "")
  }
  //getEmployees
  getEmployees(ID: any) {
    return this.httpRepository.getData(this.URL + "/getEmployees?ID=" + ID)
  }
  //getDepartment
  getDepartment(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDepartment?EMP_ID=" + EMP_ID)
  }
  //getDesignation
  getDesignation(EMP_ID: any) {
    return this.httpRepository.getData(this.URL + "/getDesignation?EMP_ID=" + EMP_ID)
  }
  //getSupervisor
  getSupervisor() {
    return this.httpRepository.getData(this.URL + "/getSupervisor")
  }
  //getKPI
  getKPI(ID: any) {
    return this.httpRepository.getData(this.URL + "/getKPI?ID=" + ID)
  }
  //getKPIList
  getKPIList() {
    return this.httpRepository.getData(this.URL + "/getKPIList")
  }

  //getDetailsByID
  getDetailsByID(ID: any): Observable<EvaluationEmp> {
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
      .then(res => res.json() as EvaluationEmp)
      .catch()
  }
  //updateOrder
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as EvaluationEmp)
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

