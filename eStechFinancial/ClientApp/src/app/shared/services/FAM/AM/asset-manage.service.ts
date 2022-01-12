
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AssetManage } from '../../../../shared';

@Injectable()
export class AssetManageService {

  URL = 'api/AssetManage';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(Query:any,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?Query=" + Query + "&priviledged_Offices="+priviledged_Offices)
  }
  //getEmployee
  getEmployee(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getEmployee?priviledged_Offices="+priviledged_Offices)
  }
  //getOffice
  getOffice(ID: any,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getOffice?ID=" + ID + "&priviledged_Offices="+priviledged_Offices)
  }
  //getDepartment
  getDepartment(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDepartment?ID=" + ID)
  }
  //getCategory
  getCategory(ID: any) {
    return this.httpRepository.getData(this.URL + "/getCategory?ID=" + ID)
  }
  //getSubCategory
  getSubCategory(ID: any) {
    return this.httpRepository.getData(this.URL + "/getSubCategory?ID=" + ID)
  }
  //getStatus
  getStatus(ID: any) {
    return this.httpRepository.getData(this.URL + "/getStatus?ID=" + ID)
  }
  //getDepreciationDate
  getDepreciationDate(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDepreciationDate?ID=" + ID)
  }
  //saveSupplier
  saveSupplier(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
  //  alert(body);
     return this.httpRepository.create(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as AssetManage)
      .catch()
  }
  //updateSupplier
  updateSupplier(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
    // alert(body);
    return this.httpRepository.update(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as AssetManage)
      .catch()
  }

  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID)
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
