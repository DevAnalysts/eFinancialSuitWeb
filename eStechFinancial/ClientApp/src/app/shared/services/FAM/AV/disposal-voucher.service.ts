import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { DisposalVoucher } from '../../../../shared';

@Injectable()
export class DisposalVoucherService {

  URL = 'api/DisposalVoucher';
  
  constructor(private httpRepository: RepositoryHttpService) { }
  //getGrid
  getGrid() {
    return this.httpRepository.getData(this.URL + "/getGrid")
  }
  //getOffice
  getOffice(priviledged_Offices:any) {
    return this.httpRepository.getData(this.URL + "/getOffice?priviledged_Offices="+priviledged_Offices)
  }
  //getRecords
  getRecords(ID: any ) {
    return this.httpRepository.getData(this.URL + "/getRecords?ID=" + ID + "")
  }

  //getDetailsByID
  getDetailsByID(ID: any) {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?ID=" + ID + "")
  }
  //saveData
  saveData(abc: Array<DisposalVoucher>): Promise<any> {
    let body = JSON.stringify(abc);
    //alert(body);
     return this.httpRepository.create(this.URL, abc )
      .toPromise()
      .then(res => res.json() as DisposalVoucher)
      .catch()
  }
  //updateData
  updateData(abc: any): Promise<any> {
    let body = JSON.stringify(abc);
    // alert(body);
    return this.httpRepository.update(this.URL, abc )
      .toPromise()
      .then(res => res.json() as DisposalVoucher)
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
