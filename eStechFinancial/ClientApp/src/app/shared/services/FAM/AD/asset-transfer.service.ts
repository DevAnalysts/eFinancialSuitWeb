
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AssetTransfer } from '../../../../shared';

@Injectable()
export class AssetTransferService {

  URL = 'api/AssetTransfer';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(Query: any,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?Query=" + Query + "&priviledged_Offices="+priviledged_Offices)
  }
 
  //getOfficeFrom
  getOfficeFrom(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getOfficeFrom?priviledged_Offices="+priviledged_Offices)
  }
  //getOfficeTo
  getOfficeTo(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getOfficeTo?priviledged_Offices="+priviledged_Offices)
  }
  //getDepartmentFrom
  getDepartmentFrom(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDepartmentFrom?ID=" + ID)
  }
  //getDepartmentTo
  getDepartmentTo(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDepartmentTo?ID=" + ID)
  }
  //getItem
  getItem() {
    return this.httpRepository.getData(this.URL + "/getItem")
  }
  //getEmployeeTo
  getEmployeeTo(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getEmployeeTo?priviledged_Offices="+priviledged_Offices)
  }
  //getEmployeeFrom
  getEmployeeFrom(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getEmployeeFrom?priviledged_Offices="+priviledged_Offices)
  }
  //getAssetDepreciation
  getAssetDepreciation(ID: any) {
    return this.httpRepository.getData(this.URL + "/getAssetDepreciation?ID=" + ID)
  }
  //saveData
  saveData(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
    //  alert(body);
     return this.httpRepository.create(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as AssetTransfer)
      .catch()
  }
  //updateData
  updateData(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
    // alert(body);
    return this.httpRepository.update(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as AssetTransfer)
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
