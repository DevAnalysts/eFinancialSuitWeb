import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AssetRequisition } from '../../../../shared';

@Injectable()
export class AssetApprovalService {

  URL = 'api/AssetApproval';
  
  constructor(private httpRepository: RepositoryHttpService) { }
  //getGrid
  getGrid(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?priviledged_Offices="+priviledged_Offices)
  }
  //getRequisition
  getRequisition() {
    return this.httpRepository.getData(this.URL + "/getRequisition")
  }
  //getRequisitionDetails
  getRequisitionDetails(ID) {
    return this.httpRepository.getData(this.URL + "/getRequisitionDetails?ID=" + ID + "")
  }
  //getEmployee
  getEmployee(ID) {
    return this.httpRepository.getData(this.URL + "/getEmployee?ID=" + ID + "")
  }

  //getItems
  getItems() {
    return this.httpRepository.getData(this.URL + "/getItems")
  }


  //getPriviledgedOffices
  getPriviledgedOffices(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getPriviledgedOffices?priviledged_Offices="+priviledged_Offices)
  
  }


  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID + "")
  }
  //saveData
  saveData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    //alert(body);
     return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as AssetRequisition)
      .catch()
  }
  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    // alert(body);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as AssetRequisition)
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
