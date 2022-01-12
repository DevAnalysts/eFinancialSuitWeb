import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { voucher } from '../../../../../shared';

@Injectable()
export class VoucherHistoryService {

  URL = 'api/VoucherHistory';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getGrid
  getGrid(voucher_ID:any, userPrivilegedOffice:any) {
    return this.httpRepository.getData(this.URL + "/getGrid?voucher_ID=" + voucher_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }


}
