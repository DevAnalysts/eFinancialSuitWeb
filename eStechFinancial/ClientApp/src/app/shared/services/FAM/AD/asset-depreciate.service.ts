import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AssetDepreciate } from '../../../../shared';



@Injectable()
export class AssetDepreciateService {

  URL = 'api/AssetDepreciate';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(Query: any,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?Query=" + Query + "&priviledged_Offices="+priviledged_Offices)
  }

  //getOffice
  getOffice(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getOffice?priviledged_Offices="+priviledged_Offices)
  }
  //getCategory
  getCategory() {
    return this.httpRepository.getData(this.URL + "/getCategory")
  }
  //getSubCategory
  getSubCategory(ID) {
    return this.httpRepository.getData(this.URL + "/getSubCategory?ID="+ID)
  }
  //getItem
  getItem(ID) {
    return this.httpRepository.getData(this.URL + "/getItem?ID=" + ID)
  }
  //getDepreciationRecord
  getDepreciationRecord(office: any, category: any, subcategory: any, item: any, depreciation: any, mode: any) {
    return this.httpRepository.getData(this.URL + "/getDepreciationRecord?office=" + office + "&category=" + category + "&subcategory=" + subcategory + "&item=" + item + "&depreciation=" + depreciation + "&mode=" + mode)
  }
  //saveData
  saveData(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
    //  alert(body);
     return this.httpRepository.create(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as AssetDepreciate)
      .catch()
  }
  //updateData
  updateData(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
    // alert(body);
    return this.httpRepository.update(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as AssetDepreciate)
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
