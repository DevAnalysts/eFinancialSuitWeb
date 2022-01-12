
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { AssetWriteoff} from '../../../../shared';

@Injectable()
export class AssetWriteoffService {

  URL = 'api/AssetWriteoff';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(Query: any,priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?Query=" + Query + "&priviledged_Offices="+priviledged_Offices)
  }

  //getOffice
  getOffice(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getOffice?priviledged_Offices="+priviledged_Offices)
  }
 
  //getItem
  getItem(ID: any) {
    return this.httpRepository.getData(this.URL + "/getItem?ID="+ID)
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
      .then(res => res.json() as AssetWriteoff)
      .catch()
  }
  //updateData
  updateData(supplier: any): Promise<any> {
    let body = JSON.stringify(supplier);
    // alert(body);
    return this.httpRepository.update(this.URL, supplier )
      .toPromise()
      .then(res => res.json() as AssetWriteoff)
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
